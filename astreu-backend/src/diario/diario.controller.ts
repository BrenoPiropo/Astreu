import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { DiarioService } from "./diario.service";
import { DiarioBordo } from "./entities/diario.entity";

@Controller("diario")
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  @Post()
  create(@Body() diarioData: Partial<DiarioBordo>) {
    return this.diarioService.create(diarioData);
  }

  @Get()
  findAll() {
    return this.diarioService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.diarioService.findOne(+id);
  }
  @Post("metas")
  createMeta(@Body() data: any) {
    return this.diarioService.createMeta(data);
  }

  @Get("metas/:usuarioId")
  findMetas(@Param("usuarioId") usuarioId: string) {
    const id = Number(usuarioId);
    if (isNaN(id)) {
      throw new BadRequestException("ID de usuário inválido");
    }
    return this.diarioService.findAllMetas(id);
  }
  @Patch("metas/:id")
  updateMeta(@Param("id") id: string, @Body("status") status: string) {
    return this.diarioService.updateMeta(+id, status);
  }

  @Delete("metas/:id")
  removeMeta(@Param("id") id: string) {
    return this.diarioService.deleteMeta(+id);
  }
}
