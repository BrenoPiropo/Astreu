// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.senha, user.senha))) {
      const { senha, ...result } = user;
      return {
        user: result,
        message: "Login realizado com sucesso",
      };
    }

    throw new UnauthorizedException("Email ou senha incorretos");
  }
}
