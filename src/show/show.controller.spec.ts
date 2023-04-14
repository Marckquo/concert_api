import { Test, TestingModule } from '@nestjs/testing';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { IShow } from './show.interface';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdminService } from 'src/admin/admin.service';
import { TezosService } from 'src/tezos/tezos.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Show } from './show.entity';
import { Admin } from 'src/admin/admin.entity';
import { EventsGateway } from 'src/ws/events/events.gateway';
import { BearerGuard } from 'src/auth/bearer.guard';

jest.mock('./show.service');
jest.mock('../auth/auth.service');

const mockRequest = (walletAddress: string) => ({
  walletAddress,
});

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

describe('ShowController', () => {
  let showController: ShowController;
  let showService: ShowService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowController],
      providers: [BearerGuard, EventsGateway, ShowService, AuthService, AdminService, TezosService, MetadataService, {
        provide: getRepositoryToken(Show),
        useFactory: mockShowRepository,
      }, {
        provide: getRepositoryToken(Admin),
        useFactory: mockAdminRepository,
      }]
    }).compile();

    showController = module.get<ShowController>(ShowController);
    showService = module.get<ShowService>(ShowService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShow', () => {
    it('should create a new show and return the created show', async () => {
      const walletAddress = 'tz1abcdefgh1234567890';
      const iShow: IShow = {
        title: 'Test Show',
        artist: 'Test Artist',
        capacity: 100,
        date: new Date(),
        place: 'Test Place',
        priceTezos: 10,
      };
      const request = mockRequest(walletAddress);
      const createdShow: IShow = { ...iShow, id: 'show-id' };

      jest.spyOn(showService, 'createShow').mockResolvedValue(createdShow);

      const result = await showController.createShow(iShow, request);

      expect(result).toEqual(createdShow);
      expect(showService.createShow).toHaveBeenCalledWith(walletAddress, iShow);
    });
  });

  describe('getShow', () => {
    it('should return show metadata', async () => {
      const id = 'show-id';
      const iShow: IShow = {
        id,
        title: 'Test Show',
        artist: 'Test Artist',
        capacity: 100,
        date: new Date(),
        place: 'Test Place',
        priceTezos: 10,
      };

      jest.spyOn(showService, 'getShowMetadata').mockResolvedValue(iShow);

      const result = await showController.getShow(id);

      expect(result).toEqual(iShow);
      expect(showService.getShowMetadata).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if show not found', async () => {
      const id = 'show-id';

      jest.spyOn(showService, 'getShowMetadata').mockResolvedValue(null);

      await expect(showController.getShow(id)).rejects.toThrowError(NotFoundException);
      expect(showService.getShowMetadata).toHaveBeenCalledWith(id);
    });
  });

  describe('getShows', () => {
    it('should return all shows with their metadata', async () => {
      const iShows: IShow[] = [
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

      jest.spyOn(showService, 'getShows').mockResolvedValue(iShows);

      const result = await showController.getShows();

      expect(result).toEqual(iShows);
      expect(showService.getShows).toHaveBeenCalled();
    });
  });

  describe('deleteShow', () => {
    it('should delete a show and return the deleted show id', async () => {
      const id = 'show-id';
      const walletAddress = 'tz1abcdefgh1234567890';
      const request = mockRequest(walletAddress);

      jest.spyOn(authService, 'canWriteShow').mockResolvedValue();
      jest.spyOn(showService, 'deleteShow').mockResolvedValue(id);

      const result = await showController.deleteShow(id, request);

      expect(result).toEqual(id);
      expect(authService.canWriteShow).toHaveBeenCalledWith(walletAddress, id);
      expect(showService.deleteShow).toHaveBeenCalledWith(id);
    });
  });

  describe('updateShow', () => {
    it('should update a show and return the updated show', async () => {
      const id = 'show-id';
      const walletAddress = 'tz1abcdefgh1234567890';
      const request = mockRequest(walletAddress);
      const iShow: IShow = {
        title: 'Updated Show',
        artist: 'Updated Artist',
        capacity: 100,
        date: new Date(),
        place: 'Updated Place',
        priceTezos: 10,
      };
      const updatedShow: IShow = { ...iShow, id };

      jest.spyOn(authService, 'canWriteShow').mockResolvedValue();
      jest.spyOn(showService, 'editShow').mockResolvedValue(updatedShow);

      const result = await showController.updateShow(id, iShow, request);

      expect(result).toEqual(updatedShow);
      expect(authService.canWriteShow).toHaveBeenCalledWith(walletAddress, id);
      expect(showService.editShow).toHaveBeenCalledWith(id, iShow);
    });
  });
});
