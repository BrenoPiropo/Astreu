import { Injectable } from '@nestjs/common';
import { CreateFotoDiarioDto } from './dto/create-foto-diario.dto';
import { UpdateFotoDiarioDto } from './dto/update-foto-diario.dto';

@Injectable()
export class FotoDiarioService {
  create(createFotoDiarioDto: CreateFotoDiarioDto) {
    return 'This action adds a new fotoDiario';
  }

  findAll() {
    return `This action returns all fotoDiario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fotoDiario`;
  }

  update(id: number, updateFotoDiarioDto: UpdateFotoDiarioDto) {
    return `This action updates a #${id} fotoDiario`;
  }

  remove(id: number) {
    return `This action removes a #${id} fotoDiario`;
  }
}
