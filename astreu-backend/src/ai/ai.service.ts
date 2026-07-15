import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Injectable, Logger } from "@nestjs/common";
import { ChromaClient } from "chromadb";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private chroma: ChromaClient;
  private embeddings: OllamaEmbeddings;
  private chat: ChatOllama;

  constructor() {
    this.chroma = new ChromaClient({ path: "http://127.0.0.1:8000" });
    this.embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large:latest",
      baseUrl: "http://127.0.0.1:11434",
    });
    this.chat = new ChatOllama({
      model: "llama3",
      baseUrl: "http://127.0.0.1:11434",
      temperature: 0, // Mais preciso para RAG acadêmico
    });
  }

  async ask(question: string) {
    // 1. Traduz a pergunta para inglês para garantir que o Embedding encontre o texto técnico
    const translation = await this.chat.invoke([
      new SystemMessage(
        "Traduza a seguinte pergunta técnica de astronomia para inglês. Retorne apenas o texto traduzido.",
      ),
      new HumanMessage(question),
    ]);
    const englishQuery = translation.content as string;

    // 2. Busca no Chroma com a query em inglês
    const collection = await this.chroma.getCollection({
      name: "astreu-local",
    });
    const questionEmbedding = await this.embeddings.embedQuery(englishQuery);

    const results = await collection.query({
      queryEmbeddings: [questionEmbedding],
      nResults: 4,
    });

    const context = results.documents[0].join("\n\n");
    const sources = [
      ...new Set(results.metadatas[0].map((m: any) => m.arquivo)),
    ];
    const formattedSources = sources.map((f) =>
      f.replace(".pdf", "").replace(/_/g, " "),
    );

    // 3. Prompt em Português pedindo a resposta em Português
    const response = await this.chat.invoke([
      new SystemMessage(`Você é um assistente acadêmico especialista em astronomia.
        Use APENAS o contexto abaixo para responder em PORTUGUÊS.
        Se a informação não estiver no contexto, diga que não sabe.
        Ao final, cite os arquivos de referência listados.
        
        Contexto:
        ${context}
      `),
      new HumanMessage(`Pergunta: ${question}`),
    ]);
    // Adicione isso antes de retornar o objeto no método 'ask'
    const rawContent = Array.isArray(response.content)
      ? response.content.map((c) => ("text" in c ? c.text : "")).join("")
      : response.content;

    let respostaLimpa = rawContent
      .replace(/\\n/g, "\n") // Corrige escapamentos duplos
      .replace(/\n\s*\d+\.\s*/g, "\n\n") // Remove números de lista (1., 2.) se quiser parágrafos
      .replace(/\n\s*-\s*/g, "\n\n") // Remove marcadores de lista
      .replace(/\s+/g, " ") // Remove espaços extras/tabs
      .trim();

    // Se você quer remover totalmente qualquer "n" ou "\n" residual que o modelo gerou:
    respostaLimpa = respostaLimpa.replace(/\\n/g, " ").replace(/\n/g, " ");
    return {
      resposta: respostaLimpa,
      referencias: formattedSources,
    };
  }
  // Mantive a lógica de seed que desenvolvemos
  async seedDatabase() {
    this.logger.log("Iniciando ingestão...");
    const collection = await this.chroma.getOrCreateCollection({
      name: "astreu-local",
      embeddingFunction: {
        generate: async (texts: string[]) =>
          texts.map(() => Array(768).fill(0)),
      },
    });

    const baseDir = path.join(process.cwd(), "uploads", "seed-articles");
    const categories = fs
      .readdirSync(baseDir)
      .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory());

    for (const category of categories) {
      await this.processCategory(category, collection, baseDir);
    }
    return { message: "Ingestão concluída!" };
  }

  private async processCategory(
    category: string,
    collection: any,
    baseDir: string,
  ) {
    const categoryPath = path.join(baseDir, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".pdf"));

    for (const file of files) {
      const existing = await collection.get({ where: { arquivo: file } });
      if (existing.ids && existing.ids.length > 0) continue;

      try {
        this.logger.log(`📄 Lendo: ${file}`);
        const loader = new PDFLoader(path.join(categoryPath, file));
        const docs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 400,
          chunkOverlap: 80,
          separators: ["\n\n", "\n", ".", " ", ""],
        });
        const chunks = await splitter.splitDocuments(docs);

        const batchSize = 3;
        for (let i = 0; i < chunks.length; i += batchSize) {
          const batch = chunks.slice(i, i + batchSize);
          const texts = batch.map((c) =>
            c.pageContent
              .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
              .substring(0, 1000),
          );

          try {
            const vectors = await this.embeddings.embedDocuments(texts);
            await collection.add({
              ids: batch.map((_, index) => `${file}-${i + index}`),
              embeddings: vectors,
              metadatas: batch.map(() => ({
                arquivo: file,
                categoria: category,
              })),
              documents: texts,
            });
          } catch (e) {
            for (const text of texts) {
              try {
                const vec = await this.embeddings.embedDocuments([text]);
                await collection.add({
                  ids: [`${file}-fallback-${Math.random()}`],
                  embeddings: vec,
                  metadatas: [{ arquivo: file, categoria: category }],
                  documents: [text],
                });
              } catch (err) {
                this.logger.error(`Falha em chunk:`);
              }
            }
          }
        }
      } catch (err) {
        this.logger.error(`Erro no livro ${file}`);
      }
    }
  }
}
