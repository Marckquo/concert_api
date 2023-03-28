import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './show.entity';
import { IShow } from './show.interface';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show)
        private showRepository: Repository<Show>
    ){}

    createShow(iShow: IShow): Promise<Show> {
        //TODO: Upload to IPFS
        const showEntity = new Show();
        showEntity.cid = '';
        showEntity.contractAddress = ''
        return this.showRepository.save(showEntity);
    }
}
