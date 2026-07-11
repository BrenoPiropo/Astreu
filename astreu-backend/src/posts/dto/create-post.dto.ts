import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsEnum(["article", "photo"])
  tipo: "article" | "photo";

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @IsString()
  @IsOptional()
  url_midia?: string;

  @IsString()
  @IsOptional()
  url_pdf?: string;

  @Transform(({ value }) => Number(value)) // Converte string do FormData para Number
  @IsNotEmpty()
  usuarioId: number;
}
