import SDKClient from './common/SDKClient'
import POSRootChainManager from './root/POSRootChainManager'
import RootChain from './root/RootChain'
import { MaticClientInitializationOptions, SendOptions } from './types/Common'

export class MaticPOSClient extends SDKClient {
  private rootChain: RootChain
  private posRootChainManager: POSRootChainManager

  constructor(options: any = {}) {
    if (!options.rootChain) {
      options.rootChain = '0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287' // RootChainProxy
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

  constructor(options: MaticClientInitializationOptions = {}) {
    super(options)
  }
}
