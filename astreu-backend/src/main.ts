// main.ts
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // REMOVA QUALQUER LINHA DE app.use(bodyParser...)
  // O NestJS já gerencia isso e o Multer precisa do stream puro.

  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });

  await app.listen(3000);
}
bootstrap();
