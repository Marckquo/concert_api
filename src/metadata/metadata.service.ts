import { Injectable } from '@nestjs/common';

const PINATA_API_KEY = "08df48d3077bbc35fcbc";
const PINATA_SECRET_API_KEY = "8517409ccd0bec03944706701d4ed721c96a2ab81411840d571c1ace6c7d1d42"

@Injectable()
export class MetadataService {

    async sendRequestToPinata(url: string, method: string, content: string) {
        var axios = require('axios');

        var config = {
        method: method,
        url: url,
        headers: { 
                'pinata_api_key':  PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            }
        };

        const res = await axios(config)
    }
    
}
