import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Injectable, Logger } from "@nestjs/common";
import { ChromaClient } from "chromadb";
import * as fs from "fs";
import * as path from "path";

// 💡 Interfaces para estruturar a nossa memória JSON
interface ChatMessage {
  role: "human" | "ai";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  userId: number; // 💡 Agora o chat pertence a um usuário
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private chroma: ChromaClient;
  private embeddings: OllamaEmbeddings;
  private chat: ChatOllama;

  // 💡 Mapa em memória que será sincronizado com o arquivo
  private sessions: Record<string, ChatSession> = {};
  // 💡 Caminho do arquivo onde o histórico será salvo
  private readonly historyFile = path.join(process.cwd(), "chat_history.json");

  constructor() {
    this.chroma = new ChromaClient({ path: "http://127.0.0.1:8000" });
    this.embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large:latest",
      baseUrl: "http://127.0.0.1:11434",
    });
    this.chat = new ChatOllama({
      model: "llama3",
      baseUrl: "http://127.0.0.1:11434",
      temperature: 0,
    });

    // 💡 Tenta carregar o histórico salvo assim que o servidor ligar
    this.loadHistory();
  }

  // --- LÓGICA DE PERSISTÊNCIA DE MEMÓRIA ---

  private loadHistory() {
    if (fs.existsSync(this.historyFile)) {
      const data = fs.readFileSync(this.historyFile, "utf-8");
      this.sessions = JSON.parse(data);
      this.logger.log(
        `📚 Histórico de chats carregado! (${Object.keys(this.sessions).length} sessões encontradas)`,
      );
    }
  }

  private saveHistory() {
    fs.writeFileSync(this.historyFile, JSON.stringify(this.sessions, null, 2));
  }

  getAllSessions(userId: number) {
    // 💡 Filtra as sessões para retornar SÓ as do usuário logado
    return Object.values(this.sessions)
      .filter((s) => s.userId === userId)
      .map((s) => ({ id: s.id, title: s.title, updatedAt: s.updatedAt }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // 💡 TRAVA DE SEGURANÇA ADICIONADA AQUI!
  getHistory(sessionId: string, userId: number) {
    const session = this.sessions[sessionId];
    if (!session) return [];

    // Se o chat não pertencer ao usuário logado, barra o acesso!
    if (session.userId !== userId) {
      this.logger.warn(
        `🚨 Tentativa de acesso negada! Usuário ${userId} tentou acessar o chat ${sessionId} do Usuário ${session.userId}`,
      );
      return [];
    }

    // Converte as mensagens do JSON para o formato que o aplicativo (GiftedChat) entende
    return session.messages
      .map((msg, index) => ({
        _id: `${sessionId}-${index}`,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.role === "human" ? 1 : 2,
          name: msg.role === "human" ? "Usuário" : "Astreu",
        },
      }))
      .reverse(); // Inverte porque o GiftedChat exibe as mais novas embaixo
  }

  // --- LÓGICA DE INTELIGÊNCIA E RAG ---

  async askWithMemory(question: string, sessionId: string, userId: number) {
    this.logger.log(
      `🔍 Sessão ${sessionId} (User ${userId}): Processando "${question}"`,
    );

    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = {
        id: sessionId,
        userId: userId, // 💡 Vincula o novo chat ao usuário logado
        title: question.substring(0, 30) + "...",
        messages: [],
        updatedAt: Date.now(),
      };
    }
    const currentSession = this.sessions[sessionId];
    // 2. Extrai as últimas 6 mensagens e converte para o formato LangChain
    const langchainHistory = currentSession.messages
      .slice(-6)
      .map((m) =>
        m.role === "human"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      );

    // 3. Tradução interna para o Inglês (Melhora o RAG)
    const translation = await this.chat.invoke([
      new SystemMessage(
        "Traduza a pergunta abaixo para inglês técnico. Retorne apenas o texto traduzido.",
      ),
      new HumanMessage(question),
    ]);
    const englishQuery =
      typeof translation.content === "string" ? translation.content : "";

    // 4. Busca no Chroma
    const collection = await this.chroma.getCollection({
      name: "astreu-local",
    });
    const questionEmbedding = await this.embeddings.embedQuery(englishQuery);
    const results = await collection.query({
      queryEmbeddings: [questionEmbedding],
      nResults: 4,
    });

    const context = results.documents[0]?.join("\n\n") || "";
    const sources = [
      ...new Set(results.metadatas[0]?.map((m: any) => m.arquivo) || []),
    ];
    const formattedSources = sources.map((f) =>
      f.replace(".pdf", "").replace(/_/g, " "),
    );

    // 5. Monta o Prompt com contexto + histórico
    const messages = [
      new SystemMessage(`Você é um assistente acadêmico especialista em astronomia.
        Use APENAS o contexto fornecido abaixo para responder em PORTUGUÊS. 
        Se a pergunta não puder ser respondida pelo contexto, diga que não sabe.
        Mantenha o tom profissional e cite as referências ao final.
        
        CONTEXTO:
        ${context}`),
      ...langchainHistory,
      new HumanMessage(question),
    ];

    const response = await this.chat.invoke(messages);

    // 6. Limpeza da resposta
    const rawContent = Array.isArray(response.content)
      ? response.content.map((c) => ("text" in c ? c.text : "")).join("")
      : response.content;

    const cleanContent = rawContent
      .replace(/\\n/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 7. Atualiza o Histórico JSON e salva no disco!
    currentSession.messages.push({
      role: "human",
      content: question,
      timestamp: Date.now(),
    });
    currentSession.messages.push({
      role: "ai",
      content: cleanContent,
      timestamp: Date.now(),
    });
    currentSession.updatedAt = Date.now();

    this.saveHistory(); // 💾 Salvando permanentemente

    return {
      resposta: cleanContent,
      referencias: formattedSources,
    };
  }

  // --- LÓGICA DE INGESTÃO (SEED) ---

  async seedDatabase() {
    this.logger.log("🚀 Iniciando processo de ingestão no banco de dados...");
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
      this.logger.log(
        `\n📂 Entrando na categoria: [${category.toUpperCase()}]`,
      );
      await this.processCategory(category, collection, baseDir);
    }

    this.logger.log(`\n🎉🎉 INGESTÃO TOTAL CONCLUÍDA COM SUCESSO! 🎉🎉`);
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
      if (existing.ids && existing.ids.length > 0) {
        this.logger.log(
          ` ⏩ [PULANDO] O arquivo "${file}" já está no banco de dados.`,
        );
        continue;
      }

      this.logger.log(` 📖 Lendo PDF: "${file}"...`);
      try {
        const loader = new PDFLoader(path.join(categoryPath, file));
        const docs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 400,
          chunkOverlap: 80,
          separators: ["\n\n", "\n", ".", " ", ""],
        });
        const chunks = await splitter.splitDocuments(docs);

        this.logger.log(
          ` 🧩 Arquivo dividido em ${chunks.length} pedaços. Iniciando geração de vetores...`,
        );

        const batchSize = 3;
        let lotesProcessados = 0;
        const totalLotes = Math.ceil(chunks.length / batchSize);

        for (let i = 0; i < chunks.length; i += batchSize) {
          lotesProcessados++;
          this.logger.log(
            `   ⏳ Processando lote ${lotesProcessados}/${totalLotes} de "${file}"...`,
          );

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
            this.logger.warn(
              `   ⚠️ Erro no lote. Tentando salvar chunk por chunk (Fallback)...`,
            );
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
                this.logger.error(
                  `   ❌ Falha definitiva em um chunk do arquivo ${file}.`,
                );
              }
            }
          }
        }
        this.logger.log(
          ` ✅ Sucesso! O arquivo "${file}" foi indexado completamente.`,
        );
      } catch (err) {
        this.logger.error(
          ` ❌ Erro ao ler/processar o arquivo ${file}: ${err}`,
        );
      }
    }
  }
}
