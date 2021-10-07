import { Contract } from 'web3-eth-contract'
import ContractsBase from '../common/ContractsBase'
import ExitManager from '../common/ExitManager'
import Web3Client from '../common/Web3Client'
import { MaticClientInitializationOptions, SendOptions } from '../types/Common'
import RootChain from './RootChain'

const ERC20_TRANSFER_EVENT_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

export default class POSRootChainManager extends ContractsBase {
  public posRootChainManager: Contract
  private exitManager: ExitManager

  constructor(options: MaticClientInitializationOptions, rootChain: RootChain, web3Client: Web3Client) {
    super(web3Client, options.network)
    this.posRootChainManager = new this.web3Client.parentWeb3.eth.Contract(
      options.network.abi('RootChainManager', 'pos'),
      options.posRootChainManager || options.network.Main.POSContracts.RootChainManagerProxy
    )
    this.exitManager = new ExitManager(rootChain, options, web3Client)
  }

  async exitHermoine(burnTxHash: string, logSignature: string, options?: SendOptions) {
    if (!this.posRootChainManager.options.address) {
      throw new Error('posRootChainManager address not found. Set it while constructing MaticPOSClient.')
    }
    const payload = await this.exitManager.buildPayloadForExitHermoine(burnTxHash, logSignature)
    const txObject = this.posRootChainManager.methods.exit(payload)
    const web3Options = await this.web3Client.fillOptions(txObject, true /* onRootChain */, options)
    if (web3Options.encodeAbi) {
      return Object.assign(web3Options, { data: txObject.encodeABI(), to: this.posRootChainManager.options.address })
    }
    return this.web3Client.send(txObject, web3Options, options)
  }

  async exitERC20Hermoine(burnTxHash: string, options?: SendOptions) {
    return this.exitHermoine(burnTxHash, ERC20_TRANSFER_EVENT_SIG, options)
  }
}
