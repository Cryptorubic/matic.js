const utils = require('./utils')

async function execute() {
  const { matic, network } = await utils.getMaticClient()
  const { from } = utils.getPrivateKey()

  const token = network.Main.Contracts.Tokens.MaticToken
  const amount = matic.web3Client.web3.utils.toWei('10.567')

  await matic.approveERC20TokensForDeposit(token, amount)
  console.log(await matic.depositERC20ForUser(token, from, amount))
}

execute().then(_ => process.exit(0))
