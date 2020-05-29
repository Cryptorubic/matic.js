const bn = require('bn.js')

const utils = require('./utils')

async function execute() {
  const { matic, network } = await utils.getMaticClient()
  const { from } = utils.getPrivateKey()
  const childTokenAddress = network.Matic.Contracts.Tokens.MaticToken
  const amount = matic.web3Client.web3.utils.toWei('1.23')

  const to = '<>'

  let bal = new bn(await matic.balanceOfERC20(from, childTokenAddress, { parent: false }))
  let toBal = new bn(await matic.balanceOfERC20(to, childTokenAddress, { parent: false }))
  console.log({ initialBalance: bal.toString(), toBal: toBal.toString() })

  let transfer
  if (childTokenAddress == '0x0000000000000000000000000000000000001010') {
    transfer = await matic.transferMaticEth(to, amount, { from, parent: false, gas: 100000 })
  } else {
    transfer = await matic.transferERC20Tokens(childTokenAddress, to, amount, { from, parent: false })
  }
  console.log(transfer)

  bal = new bn(await matic.balanceOfERC20(from, childTokenAddress, { parent: false }))
  toBal = new bn(await matic.balanceOfERC20(to, childTokenAddress, { parent: false }))
  console.log({ finalBalance: bal.toString(), toBal: toBal.toString() })
}

execute().then(_ => process.exit(0))
