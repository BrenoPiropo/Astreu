import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: "O nome não pode estar vazio" })
  nome: string;

  @IsEmail({}, { message: "O e-mail deve ser um endereço válido" })
  email: string;

  @IsString()
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  senha: string;
}
