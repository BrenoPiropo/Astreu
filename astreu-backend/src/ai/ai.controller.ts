import { Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("seed")
  seedDatabase() {
    // 💡 REMOVEMOS O AWAIT!
    // Assim o processo roda no fundo sem fazer o Insomnia dar Timeout de 30 segundos.
    this.aiService.seedDatabase();

    return {
      message:
        "🚀 Ingestão iniciada em segundo plano! Acompanhe o progresso pelo terminal do NestJS.",
    };
  }
}
