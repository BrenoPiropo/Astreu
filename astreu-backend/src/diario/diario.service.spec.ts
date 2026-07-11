import { Test, TestingModule } from '@nestjs/testing';
import { DiarioService } from './diario.service';

describe('DiarioService', () => {
  let service: DiarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiarioService],
    }).compile();

    service = module.get<DiarioService>(DiarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
