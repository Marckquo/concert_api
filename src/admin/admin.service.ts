import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>
    ){}

    validateWalletAddress(address: string): boolean {
        return address.match(/tz[123].*/gm) !== null;
    }

    findOne(walletAddress: string): Promise<Admin> {
        return this.adminRepository.findOneBy({
            walletAddress
        });
    }
}
