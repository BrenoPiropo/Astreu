import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FotoDiarioService } from './foto-diario.service';
import { CreateFotoDiarioDto } from './dto/create-foto-diario.dto';
import { UpdateFotoDiarioDto } from './dto/update-foto-diario.dto';

@Controller('foto-diario')
export class FotoDiarioController {
  constructor(private readonly fotoDiarioService: FotoDiarioService) {}

  @Post()
  create(@Body() createFotoDiarioDto: CreateFotoDiarioDto) {
    return this.fotoDiarioService.create(createFotoDiarioDto);
  }

  @Get()
  findAll() {
    return this.fotoDiarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fotoDiarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFotoDiarioDto: UpdateFotoDiarioDto) {
    return this.fotoDiarioService.update(+id, updateFotoDiarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fotoDiarioService.remove(+id);
  }
}
