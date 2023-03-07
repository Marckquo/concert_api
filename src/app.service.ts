import { Injectable } from '@nestjs/common';
import { TezosToolkit } from '@taquito/taquito';
import { validateSignature } from '@taquito/utils';
@Injectable()
export class AppService {
  async getBalance(address: string) {
    const tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet');
    const balance = await tezos.tz.getBalance(address);
    return balance.toNumber() / 1000000;
  }

  verifySignature(signature: string): boolean {
    const response = validateSignature(signature);
    // 0: invalid signature
    // 1: invalid public key
    // 2: invalid message
    // 3: valid signature
    switch (response) {
      case 3:
        return true;
      case 0:
      case 1:
      case 2:
        return false;
      default:
        return false;
    }
  }
}
