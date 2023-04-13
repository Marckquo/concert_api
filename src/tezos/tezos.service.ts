import { Injectable } from '@nestjs/common';
import { TezosToolkit } from '@taquito/taquito';
import { validateSignature, verifySignature } from '@taquito/utils';

@Injectable()
export class TezosService {
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
}
