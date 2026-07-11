import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiarioController } from "./diario.controller";
import { DiarioService } from "./diario.service";
import { DiarioBordo } from "./entities/diario.entity";
import { Meta } from "./entities/meta.entity"; // Certifique-se de importar a entidade
import { FotoDiario } from "./foto-diario/entities/foto-diario.entity";
@Module({
  imports: [TypeOrmModule.forFeature([DiarioBordo, FotoDiario, Meta])],
  controllers: [DiarioController],
  providers: [DiarioService],
})
export class DiarioModule {}
