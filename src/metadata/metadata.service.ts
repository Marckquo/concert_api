import { Injectable } from '@nestjs/common';

const PINATA_API_KEY = "08df48d3077bbc35fcbc";
const PINATA_SECRET_API_KEY = "8517409ccd0bec03944706701d4ed721c96a2ab81411840d571c1ace6c7d1d42"

@Injectable()
export class MetadataService {

    

    async sendRequestToPinJson(data: string) {
        var axios = require('axios');

        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: { 
                'Content-Type': 'application/json',
                'pinata_api_key':  PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            },
            data: data
        };
    
        const res = await axios(config);
        console.log(res.data);
    }
    
}
