import { Test } from '@nestjs/testing';
import { TezosService } from './tezos.service';
import { EventsGateway } from '../ws/events/events.gateway';
import { ShowService } from '../show/show.service';
import { IShow } from '../show/show.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Show } from '../show/show.entity';
import { MetadataService } from '../metadata/metadata.service';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/admin.entity';

const mockShowRepository = () => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
});

const mockAdminRepository = () => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
});

describe('TezosService', () => {
  let tezosService: TezosService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TezosService, EventsGateway, AdminService, MetadataService, ShowService, {
        provide: getRepositoryToken(Show),
        useFactory: mockShowRepository,
      }, {
        provide: getRepositoryToken(Admin),
        useFactory: mockAdminRepository,
      }]
    }).compile();

    tezosService = moduleRef.get<TezosService>(TezosService);
  });

  describe('verifySignature', () => {
    it('should return true for a valid signature', () => {
      // Use a valid signature, message and public key for this test
      const signature = 'sigj47SD7ZiA6tLbaxKREgWDpfwoqxM3W4yMeRJGUxwbJCi4AG5jHs4JUA9YDpBvuwNTZ1y9Yoh6m88jp6ENTz4sThsFrcTz';
      const message = 'tz1ZZGh8QWtXA5gc465GxafcwK9Gdg5PaWgf';
      const publicKey = 'edpkttWmknwVJ7MxgMZC2Fs4ERyJ2rkbcB69qhqbDif3TFegGzGQRD';

      const result = tezosService.verifySignature(signature, message, publicKey);

      expect(result).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      // Use an invalid signature, message or public key for this test
      const signature = 'invalid_signature';
      const message = 'valid_message';
      const publicKey = 'valid_public_key';

      const result = tezosService.verifySignature(signature, message, publicKey);

      expect(result).toBe(false);
    });
  });

  describe('createShowOnTezos', () => {
    it('should create a show on Tezos and update the contract address', async () => {          
      // Use a valid showId, IShow, and ownerAddress for this test
      const showId = 'abcd';
      const iShow: IShow = {
        title: 'Some show',
        artist: 'Some artist',
        capacity: 5000,
        date: new Date(),
        place: 'Some city',
        priceTezos: 50,
      };
      const ownerAddress = 'tz1ZZGh8QWtXA5gc465GxafcwK9Gdg5PaWgf';

      process.env.RPC_ADDRESS = 'https://ghostnet.tezos.marigold.dev/';
      process.env.TEZOS_PRIVATE_KEY = 'edskRmYxMiBuFturKGvEGWKLKXCchf4bRs6S1PpRKLmMzfiX9vnVqS3c9oZHqtf2MNE9Km94f3FUgbYH1pSdR1jHCQ7oQseDPa';
      process.env.CONTRACT_ADDRESS = 'KT1JXEthzfrNSS4jfjdYbyp9WM5mYbBcZbVC';
      process.env.CREATION_PRICE_TEZ = '2';

      // Mock the necessary methods and properties of TezosService dependencies
      const updateContractAddressSpy = jest
        .spyOn(tezosService['showService'], 'updateContractAddress')
        .mockImplementation();

      const publishCreationResultSpy = jest
        .spyOn(tezosService['eventsGateway'], 'publishCreationResult')
        .mockImplementation();

      await tezosService.createShowOnTezos(showId, iShow, ownerAddress);

      expect(updateContractAddressSpy).toHaveBeenCalled();
      expect(publishCreationResultSpy).toHaveBeenCalledWith({
        created: true,
        showId,
        address: expect.any(String),
      });
    }, 120000);
  });
});
