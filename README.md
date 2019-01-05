# Matic SDK

[![Build Status](https://travis-ci.org/maticnetwork/matic.js.svg?branch=master)](https://travis-ci.org/maticnetwork/matic.js)

This repository contains the `maticjs` client lib. `maticjs` makes it easy for developers, who may not be deeply familiar with smart contract development, to interact with the various components of Matic Network.

This library will help developers to move assets from Ethereum chain to Matic chain, and withdraw from Matic to Ethereum using fraud proofs.

We will be improving this library to make all features available like Plasma Faster Exit, challenge exit, finalize exit and more.

### Installation

```bash
$ npm install --save maticjs # or yarn add maticjs
```

### Getting started

```js
// Import Matic sdk
import Matic from 'maticjs'

// Create sdk instance
const matic = new Matic({

  // Set Matic provider - string or provider instance
  // Example: 'https://testnet.matic.network' OR new Web3.providers.HttpProvider('http://localhost:8545')
  maticProvider: <web3-provider>,

  // Set Mainchain provider - string or provider instance
  // Example: 'https://kovan.infura.io' OR new Web3.providers.HttpProvider('http://localhost:8545')
  parentProvider: <web3-provider>,

  // Set rootchain contract. See below for more information
  rootChainAddress: <root-contract-address>,

  // Set withdraw-manager Address. See below for more information
  withdrawManagerAddress: <withdraw-manager-address>,

  // Set deposit-manager Address. See below for more information
  depositManagerAddress: <deposit-manager-address>,

  // Set matic network's WETH address. See below for more information
  maticWethAddress: <matic-weth-address>,

  // Syncer API URL
  // Fetches tx/receipt proof data instead of fetching whole block on client side
  syncerUrl: 'https://eth-syncer.api.matic.network/api/v1', // (optional)

  // Watcher API URL
  // Fetches headerBlock info from mainchain & finds appropriate headerBlock for given blockNumber
  watcherUrl: 'https://eth-watcher.api.matic.network/api/v1', // (optional)
})

// Set wallet
// Warning: Not-safe
// matic.wallet = <private-key> // Use metamask provider or use WalletConnect provider instead.

// get token address mapped with mainchain token address
const tokenAddressOnMatic = await matic.getMappedTokenAddress(
  tokenAddress // token address on mainchain
)

// Approve token for deposit
await matic.approveTokensForDeposit(
  token,  // Token address,
  amount,  // Token amount for approval (in wei)
  options // transaction fields
)

// Deposit token into Matic chain. Remember to call `approveTokens` before
await matic.depositERC20Tokens(
  token,  // Token address
  user,   // User address (in most cases, this will be sender's address),
  amount,  // Token amount for deposit (in wei)
  options // transaction fields
)

// Deposit token into Matic chain. Remember to call `approveTokens` before
await matic.depositERC721Tokens(
  token,  // Token address
  user,   // User address (in most cases, this will be sender's address),
  amount,  // Token amount for deposit (in wei)
  options // transaction fields
)

// Transfer token on Matic
await matic.transferTokens(
  token,  // Token address
  user,   // Recipient address
  amount,  // Token amount for deposit (in wei)
  options // transaction fields
)

// Initiate withdrawal of funds from Matic and retrieve the Transaction id
await matic.startWithdraw(
  token, // Token address
  amount, // Token amount for withdraw (in wei)
  options // transaction fields
)

// Withdraw funds from the Matic chain using the Transaction id generated from the 'startWithdraw' method
// after header has been submitted to mainchain
await matic.withdraw(
  txId, // Transaction id generated from the 'startWithdraw' method
  options // transaction fields
)
```

### How it works?

The flow for asset transfers on the Matic Network is as follows:

- User deposits crypto assets in Matic contract on mainchain
- Once deposited tokens get confirmed on the main chain, the corresponding tokens will get reflected on the Matic chain.
- The user can now transfer tokens to anyone they want instantly with negligible fees. Matic chain has faster blocks (approximately ~ 1 second). That way, the transfer will be done almost instantly.
- Once a user is ready, they can withdraw remaining tokens from the mainchain by establishing proof of remaining tokens on Root contract (contract deployed on Ethereum chain)

### Contracts and addresses

**Matic Testnet**

- RPC endpoint host: https://testnet.matic.network
- TEST childchain ERC20 token: 0x343461c74133E3fA476Dbbc614a87473270a226c

**Kovan testnet addresses**

- TEST mainchain ERC20 token: 0x670568761764f53E6C10cd63b71024c31551c9EC
- Root Contract: 0x24e01716a6ac34D5f2C4C082F553D86a557543a7

### Faucet

Please write to info@matic.network to request TEST tokens for development purposes. We will soon have a faucet in place for automatic distribution of tokens for testing.

### API

- <a href="#initialize"><code>new Matic()</code></a>
- <a href="#getMappedTokenAddress"><code>matic.<b>getMappedTokenAddress()</b></code></a>
- <a href="#approveTokensForDeposit"><code>matic.<b>approveTokensForDeposit()</b></code></a>
- <a href="#depositERC20Tokens"><code>matic.<b>depositERC20Tokens()</b></code></a>
- <a href="#depositERC721Tokens"><code>matic.<b>depositERC721Tokens()</b></code></a>
- <a href="#depositEthers"><code>matic.<b>depositEthers()</b></code></a>
- <a href="#transferERC20Tokens"><code>matic.<b>transferERC20Tokens()</b></code></a>
- <a href="#transferERC721Tokens"><code>matic.<b>transferERC721Tokens()</b></code></a>
- <a href="#transferEthers"><code>matic.<b>transferEthers()</b></code></a>
- <a href="#startWithdraw"><code>matic.<b>startWithdraw()</b></code></a>
- <a href="#getHeaderObject"><code>matic.<b>getHeaderObject()</b></code></a>
- <a href="#withdraw"><code>matic.<b>withdraw()</b></code></a>
- <a href="#getTx"><code>matic.<b>getTx()</b></code></a>
- <a href="#getReceipt"><code>matic.<b>getReceipt()</b></code></a>

---

<a name="initialize"></a>

#### new Matic(options)

Creates Matic SDK instance with give options. It returns a MaticSDK object.

```js
import Matic from "maticjs"

const matic = new Matic(options)
```

- `options` is simple Javascript `object` which can have following fields:
  - `maticProvider` can be `string` or `Web3.providers` instance. This provider must connect to Matic chain. Value can be anyone of following:
    - `'https://testnet.matic.network'`
    - `new Web3.providers.HttpProvider('http://localhost:8545')`
    - [WalletConnect Provider instance](https://github.com/WalletConnect/walletconnect-monorepo#for-web3-provider-web3js)
  - `parentProvider` can be `string` or `Web3.providers` instance. This provider must connect to Ethereum chain (testnet or mainchain). Value can be anyone of following:
    - `'https://kovan.infura.io'`
    - `new Web3.providers.HttpProvider('http://localhost:8545')`
    - [WalletConnect Provider instance](https://github.com/WalletConnect/walletconnect-monorepo#for-web3-provider-web3js)
  - `rootChainAddress` must be valid Ethereum contract address.
  - `syncerUrl` must be valid API host. MaticSDK uses this value to fetch receipt/tx proofs instead of getting whole block to client side.
  - `watcherUrl` must be valid API host. MaticSDK uses this value to fetch headerBlock info from mainchain and to find appropriate headerBlock for given blockNumber.

---

<a name="getMappedTokenAddress"></a>

#### matic.getMappedTokenAddress(tokenAddress)

get matic token `address` mapped with mainchain `tokenAddress`.

- `tokenAddress` must be valid token address

This returns matic `address`.

Example:

```js
matic
  .getMappedTokenAddress("0x670568761764f53E6C10cd63b71024c31551c9EC")
  .then(address => {
    console.log("matic address", address)
  })
```

---

<a name="approveTokensForDeposit"></a>

#### matic.approveTokensForDeposit(token, amount, options)

Approves given `amount` of `token` to `rootChainContract`.

- `token` must be valid ERC20 token address
- `amount` must be token amount in wei (string, not in Number)
- `options` (optional) must be valid javascript object containing `from`, `gasPrice`, `gasLimit`, `nonce`, `value`, `onTransactionHash`, `onReceipt` or `onError`
  - `from` must be valid account address(required)
  - `gasPrice` same as Ethereum `sendTransaction`
  - `gasLimit` same as Ethereum `sendTransaction`
  - `nonce` same as Ethereum `sendTransaction`
  - `nonce` same as Ethereum `sendTransaction`
  - `value` contains ETH value. Same as Ethereum `sendTransaction`.
  - `onTransactionHash` must be `function`. This function will be called when transaction will be broadcasted.
  - `onReceipt` must be `function`. This function will be called when transaction will be included in block (when transaction gets confirmed)
  - `onError` must be `function`. This function will be called when sending transaction fails.

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
matic
  .approveTokensForDeposit("0x718Ca123...", "1000000000000000000", {
    from: "0xABc578455..."
  })
  .on("onTransactionHash", txHash => {
    console.log("New transaction", txHash)
  })
```

---

<a name="depositERC20Tokens"></a>

#### matic.depositERC20Tokens(token, user, amount, options)

Deposit given `amount` of `token` with user `user`.

- `token` must be valid ERC20 token address
- `user` must be value account address
- `amount` must be token amount in wei (string, not in Number)
- `options` see [more infomation here](#approveTokensForDeposit)

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.depositToken('0x718Ca123...', user, '1000000000000000000', {
  from: '0xABc578455...'
})
```

---

<a name="depositERC721Tokens"></a>

#### matic.depositERC721Tokens(token, user, tokenId, options)

Deposit given `tokenId` of `token` with user `user`.

- `token` must be valid ERC20 token address
- `user` must be value account address
- `tokenId` must be valid tokenId
- `options` see [more infomation here](#approveTokensForDeposit)

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.depositERC721Tokens('0x718Ca123...', user, tokenId, {
  from: '0xABc578455...'
})
```

---

<a name="depositEthers"></a>

#### matic.depositEthers(options)

Deposit `options.value` ETH with user `user`.

- `options` see [more infomation here](#approveTokensForDeposit). 
  - `value` amount of ethers.
  - `from` must be valid account address(required)

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.depositEthers('0x718Ca123...', {
  from: '0xABc578455...',
  value: '1000000000000000000'
})
```

---

<a name="transferERC20Tokens"></a>

#### matic.transferERC20Tokens(token, user, amount, options)

Transfer given `amount` of `token` to `user`.

- `token` must be valid ERC20 token address
- `user` must be value account address
- `amount` must be token amount in wei (string, not in Number)
- `options` see [more infomation here](#approveTokensForDeposit)
  - `parent` must be boolean value. For token transfer on Main chain, use `parent: true`

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.transferERC20Tokens('0x718Ca123...', user, '1000000000000000000', {
  from: '0xABc578455...',

  // For token transfer on Main network
  // parent: true
})
```

---

<a name="transferERC721Tokens"></a>

#### matic.transferERC721Tokens(token, user, tokenId, options)

Transfer ownership `tokenId` of `token` to `user`.

- `token` must be valid ERC20 token address
- `user` must be value account address
- `tokenId` tokenId
- `options` see [more infomation here](#approveTokensForDeposit)
  - `parent` must be boolean value. For token transfer on Main chain, use `parent: true`

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.transferERC721Tokens('0x718Ca123...', user, tokenId, {
  from: '0xABc578455...',

  // For token transfer on Main network
  // parent: true
})
```

---

<a name="transferEthers"></a>

#### matic.transferEthers(user, amount, options)

Transfer given `amount` of ethers to `user`.

- `user` must be value account address
- `amount` must be ethers amount in wei (string, not in Number)
- `options` see [more infomation here](#approveTokensForDeposit)
  - `parent` must be boolean value. For ether transfer on Main chain, use `parent: true`

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
const user = <your-address> or <any-account-address>

matic.transferEthers(user, '1000000000000000000', {
  from: '0xABc578455...',

  // For token transfer on Main network
  // parent: true
})
```

---

<a name="startWithdraw"></a>

#### matic.startWithdraw(token, amount, options)

Start withdraw process with given `amount` for `token`.

- `token` must be valid ERC20 token address
- `amount` must be token amount in wei (string, not in Number)
- `options` see [more infomation here](#approveTokensForDeposit)

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
matic
  .startWithdraw("0x718Ca123...", "1000000000000000000", {
    from: "0xABc578455..."
  })
  .on("onTransactionHash", txHash => {
    console.log("Started withdraw process with txId", txHash)
  })
```

---

<a name="getHeaderObject"></a>

#### matic.getHeaderObject(blockNumber)

Fetch header/checkpoint corresponding to `blockNumber`

- `blockNumber` must be valid Matic's sidechain block number

This returns `Promise` object, which will be fulfilled when header/checkpoint is found corresponding to `blockNumber`.

Example:

```js
matic.getHeaderObject(673874).then(header => {
  // header.start
  // header.end
  // header.proposer
  // header.number
})
```

---

<a name="withdraw"></a>

#### matic.withdraw(txId, options)

Withdraw tokens on mainchain using `txId` from `startWithdraw` method after header has been submitted to mainchain.

- `txId` must be valid tx hash
- `options` see [more infomation here](#approveTokensForDeposit)

This returns `Promise` object, which will be fulfilled when transaction gets confirmed (when receipt is generated).

Example:

```js
matic.withdraw("0xabcd...789", {
  from: "0xABc578455..."
})
```

---

<a name="getTx"></a>

#### matic.getTx(txId)

Get transaction object using `txId` from Matic chain.

- `txId` must be valid tx id

This returns `Promise` object.

Example:

```js
matic
  .getTx("0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b")
  .then(txObject => {
    console.log(txObject)
  })
```

---

<a name="getReceipt"></a>

#### matic.getReceipt(txId)

Get receipt object using `txId` from Matic chain.

- `txId` must be valid tx id

This returns `Promise` object.

Example:

```js
matic
  .getReceipt(
    "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
  )
  .then(obj => {
    console.log(obj)
  })
```

### Support

Please write to info@matic.network for integration support. If you have any queries, feedback or feature requests, feel free to reach out to us on telegram: [t.me/maticnetwork](https://t.me/maticnetwork)

### License

MIT
