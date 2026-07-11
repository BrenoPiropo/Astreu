import { Test, TestingModule } from '@nestjs/testing';
import { FotoDiarioController } from './foto-diario.controller';
import { FotoDiarioService } from './foto-diario.service';

describe('FotoDiarioController', () => {
  let controller: FotoDiarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FotoDiarioController],
      providers: [FotoDiarioService],
    }).compile();

    controller = module.get<FotoDiarioController>(FotoDiarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
