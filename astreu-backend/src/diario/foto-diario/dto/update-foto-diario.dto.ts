import { PartialType } from '@nestjs/mapped-types';
import { CreateFotoDiarioDto } from './create-foto-diario.dto';

export class UpdateFotoDiarioDto extends PartialType(CreateFotoDiarioDto) {}
