import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import { Admin } from 'src/admin/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { TezosService } from 'src/tezos/tezos.service';
import { Repository } from 'typeorm';
import { Show } from './show.entity';
import { IShow } from './show.interface';
import { ShowService } from './show.service';

jest.mock('../admin/admin.service');
jest.mock('../metadata/metadata.service');
jest.mock('../tezos/tezos.service');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockShowRepository = () => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
});

describe('ShowService', () => {
  let showService: ShowService;
  let adminService: AdminService;
  let metadataService: MetadataService;
  let tezosService: TezosService;
  let showRepository: Repository<Show>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowService,
        {
          provide: getRepositoryToken(Show),
          useFactory: mockShowRepository,
        },
        AdminService,
        MetadataService,
        TezosService,
      ],
    }).compile();

    showService = module.get<ShowService>(ShowService);
    adminService = module.get<AdminService>(AdminService);
    metadataService = module.get<MetadataService>(MetadataService);
    tezosService = module.get<TezosService>(TezosService);
    showRepository = module.get<Repository<Show>>(getRepositoryToken(Show));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShow', () => {
    it('should create a new show and return the created show', async () => {
      const walletAddress = 'tz1abcdefgh1234567890';
      const show: IShow = {
        title: 'Test Show',
        artist: 'Test Artist',
        capacity: 100,
        date: new Date(),
        place: 'Test Place',
        priceTezos: 10,
      };

      const admin = new Admin;
      admin.id = 'admin-id';
      const cid = 'test-cid';
      const savedShow: Show = {
        id: 'show-id', 
        cid: cid, 
        owner: admin,
        contractAddress: ''
      };
      const createdShow: IShow = { ...show, id: 'show-id' };

      jest.spyOn(adminService, 'findOne').mockResolvedValue(admin);
      jest.spyOn(metadataService, 'sendRequestToPinJson').mockResolvedValue(cid);
      jest.spyOn(showRepository, 'save').mockResolvedValue(savedShow);
      jest.spyOn(tezosService, 'createShowOnTezos').mockResolvedValue();

      const result = await showService.createShow(walletAddress, show);

      expect(result).toEqual(createdShow);
      expect(adminService.findOne).toHaveBeenCalledWith(walletAddress);
      expect(metadataService.sendRequestToPinJson).toHaveBeenCalledWith(show);
      expect(showRepository.save).toHaveBeenCalled();
      expect(tezosService.createShowOnTezos).toHaveBeenCalledWith(savedShow.id, createdShow, walletAddress);
    });
  });

  describe('getShowMetadata', () => {
    it('should return show metadata', async () => {
      const admin = new Admin();
      const id = 'show-id-1';
      const cid = 'test-cid';
      const show: Show = {
        id, cid,
        contractAddress: '',
        owner: admin
      };
      const metadata: IShow = {
        title: 'Test Show',
        artist: 'Test Artist',
        capacity: 100,
        date: new Date(),
        place: 'Test Place',
        priceTezos: 10,
      };

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(show);
      mockedAxios.get.mockResolvedValue({ data: metadata });

      const result = await showService.getShowMetadata(id);

      expect(result).toEqual({ ...metadata, id });
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(axios.get).toHaveBeenCalledWith(`https://gateway.pinata.cloud/ipfs/${cid}`, {"headers": {"Content-Type": "application/json"}});
    });

    it('should return null if show not found', async () => {
      const id = 'show-id-1';

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(null);

      const result = await showService.getShowMetadata(id);

      expect(result).toBeNull();
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('getShows', () => {
    it('should return all shows with their metadata', async () => {
      const admin = new Admin();
      const show1: Show = {
        id: 'show-id-1',
        cid: '',
        contractAddress: '',
        owner: admin
      };
      const show2: Show = {
        id: 'show-id-2',
        cid: '',
        contractAddress: '',
        owner: admin
      };
      const shows = [show1, show2];
      const metadata: IShow[] = [
        {
          id: 'show-id-1',
          title: 'Test Show 1',
          artist: 'Test Artist 1',
          capacity: 100,
          date: new Date(),
          place: 'Test Place 1',
          priceTezos: 10,
        },
        {
          id: 'show-id-2',
          title: 'Test Show 2',
          artist: 'Test Artist 2',
          capacity: 100,
          date: new Date(),
          place: 'Test Place 2',
          priceTezos: 10,
        },
      ];

      jest.spyOn(showRepository, 'find').mockResolvedValue(shows);
      jest.spyOn(showService, 'getShowMetadata').mockImplementation((id) => {
        return Promise.resolve(metadata.find((m) => m.id === id));
      });

      const result = await showService.getShows();

      expect(result).toEqual(metadata);
      expect(showRepository.find).toHaveBeenCalled();
      expect(showService.getShowMetadata).toHaveBeenCalledTimes(shows.length);
    });
  });

  describe('deleteShow', () => {
    it('should delete a show and unpin its metadata', async () => {
      const admin = new Admin();
      const id = 'show-id-1';
      const cid = 'test-cid';
      const show: Show = {
        id, cid,
        contractAddress: '',
        owner: admin
      };

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(show);
      jest.spyOn(showRepository, 'delete').mockResolvedValue(undefined);
      jest.spyOn(metadataService, 'sendRequestToUnpinJson').mockResolvedValue(cid);

      const result = await showService.deleteShow(id);

      expect(result).toEqual(cid);
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(showRepository.delete).toHaveBeenCalledWith({ id });
      expect(metadataService.sendRequestToUnpinJson).toHaveBeenCalledWith(cid);
    });

    it('should throw NotFoundException if show not found', async () => {
      const id = 'show-id-1';

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(null);

      await expect(showService.deleteShow(id)).rejects.toThrowError(NotFoundException);
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('editShow', () => {
    it('should edit a show and return the edited show', async () => {
      const admin = new Admin();
      const id = 'show-id-1';
      const cid = 'test-cid';
      const show: Show = {
        id, cid,
        contractAddress: '',
        owner: admin
      };
      const iShow: IShow = {
        title: 'Updated Show',
        artist: 'Updated Artist',
        capacity: 100,
        date: new Date(),
        place: 'Updated Place',
        priceTezos: 10,
      };
      const newCid = 'new-cid';

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(show);
      jest.spyOn(metadataService, 'sendRequestsToEditJson').mockResolvedValue(newCid);
      jest.spyOn(showRepository, 'update').mockResolvedValue(undefined);

      const result = await showService.editShow(id, iShow);

      expect(result).toEqual(iShow);
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(metadataService.sendRequestsToEditJson).toHaveBeenCalledWith(cid, iShow);
      expect(showRepository.update).toHaveBeenCalledWith({ id }, { cid: newCid });
    });

    it('should throw NotFoundException if show not found', async () => {
      const id = 'show-id-1';
      const iShow: IShow = {
        title: 'Updated Show',
        artist: 'Updated Artist',
        capacity: 100,
        date: new Date(),
        place: 'Updated Place',
        priceTezos: 10,
      };

      jest.spyOn(showRepository, 'findOneBy').mockResolvedValue(null);

      await expect(showService.editShow(id, iShow)).rejects.toThrowError(NotFoundException);
      expect(showRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('updateContractAddress', () => {
    it('should update contract address for a show', async () => {
      const id = 'show-id-1';
      const contractAddress = 'new-contract-address';

      jest.spyOn(showRepository, 'update').mockResolvedValue(undefined);

      await showService.updateContractAddress(id, contractAddress);

      expect(showRepository.update).toHaveBeenCalledWith({ id }, { contractAddress });
    });
  });
});