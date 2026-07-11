import { Module } from '@nestjs/common';
import { FotoDiarioService } from './foto-diario.service';
import { FotoDiarioController } from './foto-diario.controller';

@Module({
  controllers: [FotoDiarioController],
  providers: [FotoDiarioService],
})
export class FotoDiarioModule {}
