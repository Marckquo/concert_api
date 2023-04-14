import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';


const mockAdminRepository = () => ({
  findOne: jest.fn(),
});

describe('AdminService', () => {
  let adminService: AdminService;
  let adminRepository: Repository<Admin>;

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
          providers: [
              AdminService,
              {
                  provide: getRepositoryToken(Admin),
                  useFactory: mockAdminRepository,
              },
          ],
      }).compile();

      adminService = module.get<AdminService>(AdminService);
      adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('validateWalletAddress', () => {
      it('should return true for valid wallet addresses', () => {
          const validAddress = 'tz1abcdefgh1234567890';
          expect(adminService.validateWalletAddress(validAddress)).toBe(true);
      });

      it('should return false for invalid wallet addresses', () => {
          const invalidAddress = 'ZAERTYUJNBVCFDRTYHN?';
          expect(adminService.validateWalletAddress(invalidAddress)).toBe(false);
      });
  });

  describe('findOne', () => {
      it('should find one admin with the given walletAddress', async () => {
          const walletAddress = 'tz1abcdefgh1234567890';
          const expectedAdmin = new Admin();
          expectedAdmin.walletAddress = walletAddress;
          jest.spyOn(adminRepository, 'findOne').mockResolvedValue(expectedAdmin);

          const foundAdmin = await adminService.findOne(walletAddress);

          expect(foundAdmin).toEqual(expectedAdmin);
          expect(adminRepository.findOne).toHaveBeenCalledWith({
              where: { walletAddress },
              relations: ['shows'],
          });
      });
  });

  describe('isAdmin', () => {
      it('should return true if an admin with the given walletAddress exists', async () => {
          const walletAddress = 'tz1abcdefgh1234567890';
          const admin = new Admin();
          admin.walletAddress = walletAddress;
          jest.spyOn(adminService, 'findOne').mockResolvedValue(admin);

          const result = await adminService.isAdmin(walletAddress);

          expect(result).toBe(true);
          expect(adminService.findOne).toHaveBeenCalledWith(walletAddress);
      });

      it('should return false if an admin with the given walletAddress does not exist', async () => {
          const walletAddress = 'tz1abcdefgh1234567890';
          jest.spyOn(adminService, 'findOne').mockResolvedValue(null);

          const result = await adminService.isAdmin(walletAddress);

          expect(result).toBe(false);
          expect(adminService.findOne).toHaveBeenCalledWith(walletAddress);
      });
  });
});
