const utils = require('ethereumjs-util')
const SafeBuffer = require('safe-buffer').Buffer

const sha3 = utils.keccak256

export default class MerkleTree {
  leaves: any
  layers: any

  constructor(leaves = []) {
    if (leaves.length < 1) {
      throw new Error('Atleast 1 leaf needed')
    }

    const depth = Math.ceil(Math.log(leaves.length) / Math.log(2))
    if (depth > 20) {
      throw new Error('Depth must be 20 or less')
    }

    this.leaves = leaves.concat(Array.from(Array(Math.pow(2, depth) - leaves.length), () => utils.zeros(32)))
    this.layers = [this.leaves]
    this.createHashes(this.leaves)
  }

  createHashes(nodes) {
    if (nodes.length === 1) {
      return false
    }

    const treeLevel = []
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i]
      const right = nodes[i + 1]
      const data = SafeBuffer.concat([left, right])
      treeLevel.push(sha3(data))
    }

    // is odd number of nodes
    if (nodes.length % 2 === 1) {
      treeLevel.push(nodes[nodes.length - 1])
    }

    this.layers.push(treeLevel)
    this.createHashes(treeLevel)
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0]
  }
}

module.exports = MerkleTree
