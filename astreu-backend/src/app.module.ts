import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Módulos
import { DiarioModule } from "./diario/diario.module";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";

import { AuthModule } from "./auth/auth.module";
import { DiarioBordo } from "./diario/entities/diario.entity"; // O CLI gera como diario.entity.ts
import { Meta } from "./diario/entities/meta.entity";
import { FotoDiario } from "./diario/foto-diario/entities/foto-diario.entity"; // Caminho da nova pasta
import { GalleryModule } from "./gallery/gallery.module";
import { PostComunidade } from "./posts/entities/post.entity"; // O CLI gera como post.entity.ts
import { User } from "./users/entities/user.entity";

@Module({
  imports: [
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
  ],
})
export class AppModule {}
