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
}
