import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiarioBordo } from "./entities/diario.entity";
import { Meta } from "./entities/meta.entity";

@Injectable()
export class DiarioService {
  constructor(
    @InjectRepository(DiarioBordo) private diarioRepo: Repository<DiarioBordo>,
    @InjectRepository(Meta) private metaRepo: Repository<Meta>,
  ) {}

  async create(diarioData: any) {
    // diarioData deve conter: titulo_observacao, relato, data_observacao e usuario (id)
    const entry = this.diarioRepo.create(diarioData);
    return await this.diarioRepo.save(entry);
  }

  async findAll() {
    return await this.diarioRepo.find({
      relations: ["fotos", "usuario"], // Traz as fotos e o dono do diário
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const entry = await this.diarioRepo.findOne({
      where: { id },
      relations: ["fotos"],
    });
    if (!entry)
      throw new NotFoundException("Registro do diário não encontrado");
    return entry;
  }
  async createMeta(data: any) {
    const meta = this.metaRepo.create(data);
    return await this.metaRepo.save(meta);
  }

  async findAllMetas(usuarioId: number) {
    return await this.metaRepo.find({ where: { usuario: { id: usuarioId } } });
  }

  async updateMeta(id: number, status: string) {
    return await this.metaRepo.update(id, { status: status as any });
  }

  async deleteMeta(id: number) {
    return await this.metaRepo.delete(id);
  }
}
