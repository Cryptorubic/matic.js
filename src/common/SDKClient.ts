import ContractsBase from '../common/ContractsBase'
import Web3Client from '../common/Web3Client'

export default class SDKClient extends ContractsBase {
  constructor(options: any = {}) {
    const web3Client = new Web3Client(
      options.parentProvider,
      options.maticProvider,
      options.parentDefaultOptions || {},
      options.maticDefaultOptions || {},
      true,
      false
    )
    super(web3Client)
  }
}
