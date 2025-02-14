import BN from 'bn.js'

import Web3Client from './Web3Client'

export default class ContractsBase {
  web3Client: Web3Client

  constructor(web3Client: Web3Client) {
    this.web3Client = web3Client
  }

  public encode(number: BN | string | number) {
    if (typeof number === 'number') {
      number = new BN(number)
    } else if (typeof number === 'string') {
      if (number.slice(0, 2) === '0x') return number
      number = new BN(number)
    }
    if (BN.isBN(number)) {
      return '0x' + number.toString(16)
    }
  }
}
