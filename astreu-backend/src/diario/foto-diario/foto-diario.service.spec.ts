import { Test, TestingModule } from '@nestjs/testing';
import { FotoDiarioService } from './foto-diario.service';

describe('FotoDiarioService', () => {
  let service: FotoDiarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FotoDiarioService],
    }).compile();

    service = module.get<FotoDiarioService>(FotoDiarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
