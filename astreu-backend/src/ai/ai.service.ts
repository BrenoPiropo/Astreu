import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Injectable, Logger } from "@nestjs/common";
import { Pinecone } from "@pinecone-database/pinecone";
import * as fs from "fs";
import * as path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Função para dar um "respiro" nas APIs gratuitas
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private pinecone: Pinecone;
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "text-embedding-004",
    });
  }

  async seedDatabase() {
    this.logger.log("Iniciando o processamento dos PDFs para o Pinecone...");
    this.logger.warn(
      "⚠️ Este processo pode demorar alguns minutos. Não cancele!",
    );

    const baseDir = path.join(process.cwd(), "uploads", "seed-articles");
    const pineconeIndex = this.pinecone.Index(
      process.env.PINECONE_INDEX_NAME || "astreu-index",
    );

    const categories = fs
      .readdirSync(baseDir)
      .filter((file) => fs.statSync(path.join(baseDir, file)).isDirectory());

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    let totalChunks = 0;

    for (const category of categories) {
      const categoryPath = path.join(baseDir, category);
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".pdf"));

      for (const file of files) {
        this.logger.log(`Processando: [${category}] ${file}...`);
        const filePath = path.join(categoryPath, file);

        try {
          const loader = new PDFLoader(filePath);
          const docs = await loader.load();

          const textoCompleto = docs.map((doc) => doc.pageContent).join(" ");
          const textoLimpo = textoCompleto.replace(/\s+/g, " ").trim();

          // 💡 VERIFICAÇÃO 1: Avisa quantos caracteres leu
          this.logger.log(`📄 Lidos ${textoLimpo.length} caracteres do PDF.`);

          // 💡 VERIFICAÇÃO 2: Se não leu nada (PDF imagem/corrompido), ele pula esse arquivo!
          if (textoLimpo.length === 0) {
            this.logger.warn(
              `⚠️ PDF sem texto detectável (Pode ser escaneado ou vazio). Pulando arquivo...`,
            );
            continue;
          }

          const chunks = await textSplitter.createDocuments(
            [textoLimpo],
            [
              {
                categoria: category,
                arquivo: file,
                fonte: "Astreu Hub Dataset",
              },
            ],
          );

          await PineconeStore.fromDocuments(chunks, this.embeddings, {
            pineconeIndex,
          });

          totalChunks += chunks.length;
          this.logger.log(
            `✅ ${chunks.length} vetores salvos do arquivo: ${file}`,
          );

          // Pausa de 5 segundos para não estourar a API do Google/Pinecone
          this.logger.log(`⏳ Aguardando 5 segundos para esfriar a API...`);
          await sleep(5000);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.error(
            `❌ Erro ao processar o arquivo ${file}:`,
            errorMessage,
          );
        }
      }
    }

    this.logger.log(
      `🎉 Ingestão concluída! ${totalChunks} pedaços de texto vetorizados e salvos no Pinecone.`,
    );
    return {
      message: "Seed do banco vetorial finalizado com sucesso!",
      totalChunks,
    };
  }
}
