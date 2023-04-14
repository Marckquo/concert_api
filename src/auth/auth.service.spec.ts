import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Admin } from 'src/admin/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { Show } from 'src/show/show.entity';
import { AuthService } from './auth.service';

const mockAdminService = () => ({
  findOne: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let adminService: AdminService;

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
          providers: [
              AuthService,
              {
                  provide: AdminService,
                  useFactory: mockAdminService,
              },
          ],
      }).compile();

      authService = module.get<AuthService>(AuthService);
      adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('canWriteShow', () => {
      const walletAddress = 'tz1abcdefgh1234567890';
      const showId = '123';

      it('should not throw ForbiddenException when an admin has the show', async () => {
          const admin = new Admin();
          admin.walletAddress = walletAddress;
          const show = new Show();
          show.id = showId
          admin.shows = [show];

          jest.spyOn(adminService, 'findOne').mockResolvedValue(admin);

          await expect(authService.canWriteShow(walletAddress, showId)).resolves.not.toThrow();
          expect(adminService.findOne).toHaveBeenCalledWith(walletAddress);
      });

      it('should throw ForbiddenException when an admin does not have the show', async () => {
          const admin = new Admin();
          admin.walletAddress = walletAddress;
          admin.shows = [];

          jest.spyOn(adminService, 'findOne').mockResolvedValue(admin);

          await expect(authService.canWriteShow(walletAddress, showId)).rejects.toThrow(ForbiddenException);
          expect(adminService.findOne).toHaveBeenCalledWith(walletAddress);
      });
  });
});