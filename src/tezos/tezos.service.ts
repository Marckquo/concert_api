import { Injectable } from '@nestjs/common';
import { TezosToolkit } from '@taquito/taquito';
import { validateSignature, verifySignature } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
import { IShow } from '../show/show.interface';
import { EventsGateway } from '../ws/events/events.gateway';
import { ShowService } from '../show/show.service';

@Injectable()
export class TezosService {
    constructor(
        private readonly eventsGateway: EventsGateway,
        private readonly showService: ShowService){}

    verifySignature(signature: string, message: string, publicKey: string): boolean {
        const response = validateSignature(signature);
        // 0: invalid signature
        // 1: invalid public key
        // 2: invalid message
        // 3: valid signature
        switch (response) {
            case 3:
                return verifySignature(message, publicKey, signature);
            case 0:
            case 1:
            case 2:
                return false;
            default:
                return false;
        }
    }

    async createShowOnTezos(showId: string, iShow: IShow, ownerAddress: string) {
        const capacity = iShow.capacity;
        const ticketPrice = iShow.priceTezos;
        const Tezos = new TezosToolkit(process.env.RPC_ADDRESS ?? '');
        Tezos.setProvider({
          signer: new InMemorySigner(process.env.TEZOS_PRIVATE_KEY ?? ''),
        });
        const contract = await Tezos.contract.at(process.env.CONTRACT_ADDRESS ?? '');
        const operation = await contract.methods.createConcert(capacity, ownerAddress, ticketPrice).send({amount: parseInt(process.env.CREATION_PRICE_TEZ ?? '1')});
        operation.confirmation(3)
        .then(() => {
            return this.showService.updateContractAddress(showId, operation.destination);
        })
        .then(() => {
            this.eventsGateway.publishCreationResult({
                created: true,
                showId,
                address: operation.destination
            });
        })
        .catch(() => {
            this.eventsGateway.publishCreationResult({
                created: false,
                showId,
            });
        })
    }
}
