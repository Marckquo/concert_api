import { Test, TestingModule } from '@nestjs/testing';
import { TezosService } from './tezos.service';

describe('TezosService', () => {
  let service: TezosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TezosService],
    }).compile();

    service = module.get<TezosService>(TezosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
