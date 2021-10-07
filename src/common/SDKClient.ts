import Network from '@maticnetwork/meta/network'
import ContractsBase from '../common/ContractsBase'
import Web3Client from '../common/Web3Client'

export default class SDKClient extends ContractsBase {
  static initializeNetwork(network = 'testnet', version = 'mumbai') {
    const _network = new Network(network, version)
    if (!_network) throw new Error(`network ${network} - ${version} is not supported`)
    return _network
  }

  constructor(options: any = {}) {
    const web3Client = new Web3Client(
      options.parentProvider || options.network.Main.RPC,
      options.maticProvider || options.network.Matic.RPC,
      options.parentDefaultOptions || {},
      options.maticDefaultOptions || {},
      options.network.Main.SupportsEIP1559,
      options.network.Matic.SupportsEIP1559
    )
    super(web3Client, options.network)
  }
}
