import { Test, TestingModule } from '@nestjs/testing';
import { DiarioController } from './diario.controller';
import { DiarioService } from './diario.service';
import { BadRequestException } from '@nestjs/common';

describe('DiarioController', () => {
  let controller: DiarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiarioController],
      providers: [DiarioService],
    }).compile();

    controller = module.get<DiarioController>(DiarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

