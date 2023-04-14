import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { BearerGuard } from 'src/auth/bearer.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

jest.mock('./admin.service');

describe('AdminController', () => {
    let controller: AdminController;
    let adminService: AdminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminController],
            providers: [AdminService, Reflector],
        })
        .overrideGuard(BearerGuard)
        .useValue({})
        .compile();

        controller = module.get<AdminController>(AdminController);
        adminService = module.get<AdminService>(AdminService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('isAdmin', () => {
        it('should return isAdmin status', async () => {
            const walletAddress = 'tz1abcdefgh1234567890';
            const request = { walletAddress };
            const expectedResult = { isAdmin: true };

            jest.spyOn(adminService, 'isAdmin').mockResolvedValue(true);

            const result = await controller.isAdmin(request);
            expect(result).toEqual(expectedResult);
            expect(adminService.isAdmin).toHaveBeenCalledWith(walletAddress);
        });
    });
});