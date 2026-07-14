import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config"; // <-- 1. Importação do ConfigModule adicionada
import { TypeOrmModule } from "@nestjs/typeorm";

// Módulos
import { DiarioModule } from "./diario/diario.module";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";

import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { DiarioBordo } from "./diario/entities/diario.entity"; // O CLI gera como diario.entity.ts
import { Meta } from "./diario/entities/meta.entity";
import { FotoDiario } from "./diario/foto-diario/entities/foto-diario.entity"; // Caminho da nova pasta
import { GalleryModule } from "./gallery/gallery.module";
import { PostComunidade } from "./posts/entities/post.entity"; // O CLI gera como post.entity.ts
import { User } from "./users/entities/user.entity";

@Module({
  imports: [
    // 2. O ConfigModule deve ser o PRIMEIRO item para carregar o .env antes de tudo
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Minerva123",
      database: "astreu_db",
      entities: [User, PostComunidade, DiarioBordo, FotoDiario, Meta],
      synchronize: true,
      logging: true,
    }),
    GalleryModule,
    UsersModule,
    PostsModule,
    DiarioModule,
    AuthModule,
    AiModule,
  ],
})
export class AppModule {}
