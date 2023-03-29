import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MetadataService {
    sendRequestToPinJson(data: object): Promise<string> {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

        const headers = {
            'Content-Type': 'application/json',
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
        };

        return axios.post(url, {
            pinataContent: data
        }, {
            headers
        }).then(res => res.data.IpfsHash);
    }

    sendRequestToUnpinJson(cid: string): Promise<string> {
        const url = `https://api.pinata.cloud/pinning/unpin/${cid}`;

        const headers = {
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
        };

        return axios.delete(url, {
            headers
        }).then(res => res.data);
    }

    sendRequestsToEditJson(cid: string, data: object): Promise<string> {
        let newCid;
        return this.sendRequestToPinJson(data)
        .then(cidFromPinata => {
            newCid = cidFromPinata;

            return this.sendRequestToUnpinJson(cid);
        })
        .then(() => {
            return newCid;
        })
    }
}
