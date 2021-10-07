import SDKClient from './common/SDKClient'
import POSRootChainManager from './root/POSRootChainManager'
import RootChain from './root/RootChain'
import { MaticClientInitializationOptions, SendOptions } from './types/Common'
import { mapPromise } from './common/MapPromise'

export class MaticPOSClient extends SDKClient {
  private rootChain: RootChain
  private posRootChainManager: POSRootChainManager

  constructor(options: any = {}) {
    options.network = SDKClient.initializeNetwork(options.network, options.version)
    if (!options.rootChain) {
      options.rootChain = options.network.Main.Contracts.RootChainProxy
    }
    super(options)
    this.rootChain = new RootChain(options, this.web3Client)
    this.posRootChainManager = new POSRootChainManager(options, this.rootChain, this.web3Client)
  }

  exitERC20(txHash: string, options?: SendOptions) {
    if (!txHash) {
      throw new Error(`txHash not provided`)
    }
    if (options && !options.from) {
      throw new Error(`from missing`)
    }
    return this.posRootChainManager.exitERC20Hermoine(txHash, options)
  }
}

export default class Matic extends SDKClient {
  public static MaticPOSClient = MaticPOSClient // workaround for web compatibility
  public static mapPromise = mapPromise // workaround for web compatibility

  constructor(options: MaticClientInitializationOptions = {}) {
    const network = SDKClient.initializeNetwork(options.network, options.version)
    // override contract addresses if they were provided during initialization
    options = Object.assign(
      {
        registry: network.Main.Contracts.Registry,
        rootChain: network.Main.Contracts.RootChainProxy,
        depositManager: network.Main.Contracts.DepositManagerProxy,
        withdrawManager: network.Main.Contracts.WithdrawManagerProxy,
      },
      options
    )
    options.network = network
    super(options)
  }
}
