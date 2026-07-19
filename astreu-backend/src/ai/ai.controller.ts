import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("seed")
  seedDatabase() {
    this.aiService.seedDatabase();
    return {
      message:
        "🚀 Ingestão iniciada em segundo plano! Acompanhe o progresso pelo terminal.",
    };
  }

  @Post("ask")
  async ask(
    @Body() body: { query: string; sessionId?: string; userId: number },
  ) {
    if (!body.query || !body.userId) {
      return { error: "Pergunta e ID do usuário são obrigatórios." };
    }

    const result = await this.aiService.askWithMemory(
      body.query,
      body.sessionId || `default-${body.userId}`,
      body.userId,
    );

    return { answer: result.resposta };
  }

  // 💡 Agora recebe o userId pela URL (?userId=1)
  @Get("sessions")
  getSessions(@Query("userId") userId: string) {
    if (!userId) return [];
    return this.aiService.getAllSessions(Number(userId));
  }

  // 💡 Agora exigimos o userId na URL para provar quem está pedindo o histórico
  @Get("history/:sessionId")
  getHistory(
    @Param("sessionId") sessionId: string,
    @Query("userId") userId: string,
  ) {
    if (!userId) return [];
    return this.aiService.getHistory(sessionId, Number(userId));
  }
}
