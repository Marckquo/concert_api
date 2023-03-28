import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './show.entity';
import { IShow } from './show.interface';
import axios from 'axios';
import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show)
        private showRepository: Repository<Show>,
        private readonly metadataService: MetadataService
    ){}

    createShow(iShow: IShow): Promise<IShow> {
        //TODO: Upload to Tezos
        const showEntity = new Show();
        return this.metadataService.sendRequestToPinJson(iShow)
        .then(cid => {
            showEntity.cid = cid;
            showEntity.contractAddress = '';
            return this.showRepository.save(showEntity)
        })
        .then(savedEntity => {
            let createdShow = {...iShow};
            createdShow.id = savedEntity.id;

            return createdShow;
        })
    }

    getShowMetadata(id: string): Promise<IShow> {
        return this.showRepository.findOneBy({
            id
        }).then(show => {
            if (! show){
                return null;
            }

            const url = `https://gateway.pinata.cloud/ipfs/${show.cid}`;

            const headers = {
                'Content-Type': 'application/json',
            };
    
            return axios.get(url, {
                headers
            }).then(res => res.data);
        })
    }
}
