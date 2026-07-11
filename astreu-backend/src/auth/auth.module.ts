import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule], // Importante para o AuthService acessar o UsersService
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
