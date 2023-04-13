import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './show.entity';
import { IShow } from './show.interface';
import axios from 'axios';
import { MetadataService } from '../metadata/metadata.service';
import { TezosService } from 'src/tezos/tezos.service';

@Injectable()
export class ShowService {
    constructor(
        @InjectRepository(Show)
        private showRepository: Repository<Show>,
        private readonly metadataService: MetadataService,
        private readonly tezosService: TezosService
    ) { }

    createShow(walletAddress: string, iShow: IShow): Promise<IShow> {
        const showEntity = new Show();
        return this.metadataService.sendRequestToPinJson(iShow)
            .then(cid => {
                showEntity.cid = cid;
                showEntity.contractAddress = '';
                return this.showRepository.save(showEntity)
            })
            .then(savedEntity => {
                let createdShow = { ...iShow };
                createdShow.id = savedEntity.id;

                this.tezosService.createShowOnTezos(createdShow.id, createdShow, walletAddress);

                return createdShow;
            })
    }

    getShowMetadata(id: string): Promise<IShow> {
        return this.showRepository.findOneBy({
            id
        }).then(show => {
            if (!show) {
                return null;
            }

            const url = `https://gateway.pinata.cloud/ipfs/${show.cid}`;

            const headers = {
                'Content-Type': 'application/json',
            };

            return axios.get(url, {
                headers
            }).then(res => {
                let iShow = res.data;
                iShow.id = id;

                return iShow;
            });
        })
    }

    getShows(): Promise<IShow[]> {
        return this.showRepository.find().then(shows => {
            const promises = shows.map(show => this.getShowMetadata(show.id));
            return Promise.all(promises);
        })
    }

    deleteShow(id: string): Promise<string> {
        let cid;
        return this.showRepository.findOneBy({
            id
        }).then(show => {
            if (!show) {
                throw new NotFoundException();
            }

            cid = show.cid;

            return this.showRepository.delete({
                id
            });
        })
            .then(() => {
                return this.metadataService.sendRequestToUnpinJson(cid);
            })
    }

    editShow(id: string, iShow: IShow): Promise<IShow> {
        let cid;
        return this.showRepository.findOneBy({
            id
        }).then(show => {
            if (!show) {
                throw new NotFoundException();
            }

            cid = show.cid;

            return this.metadataService.sendRequestsToEditJson(cid, iShow);
        })
            .then(newCid => {
                return this.showRepository.update({
                    id
                }, {
                    cid: newCid
                })
            })
            .then(() => {
                return iShow;
            })
    }
}
