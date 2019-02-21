const bs58 = require('bs58')
const { randomBytes, createHash } = require('crypto')
const secp256k1 = require('secp256k1')

function generatePrivKey () {
  let privKey
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))
  return new PrivKey(privKey)
}

function privKeyFromWIF (encoded) {
  if (encoded === '' || encoded === null) {
    return null
  }
  const bytes = bs58.decode(encoded)
  if (bytes.length <= 5 || bytes[0] !== 1) {
    return null
  }
  const data = bytes.slice(1, bytes.length - 4)
  const vinfo = bytes.slice(bytes.length - 4, bytes.length)
  const hash1 = createHash('sha256')
  hash1.update(data)
  const sum1 = hash1.digest()
  const hash2 = createHash('sha256')
  hash2.update(sum1)
  const sum2 = hash2.digest()
  if (vinfo.toString() === sum2.slice(0, 4).toString()) {
    const priv = new PrivKey(data)
    if (priv.isValid()) {
      return priv
    } else {
      return null
    }
  } else {
    return null
  }
}

function pubKeyFromWIF (encoded) {
  if (encoded === '' || encoded === null) {
    return null
  }
  if (encoded.length <= 3) {
    return null
  }
  console.log(encoded.slice(0, 3))
  if (encoded.slice(0, 3) !== 'COS') {
    return null
  }
  const bytes = bs58.decode(encoded.slice(3, encoded.length))
  if (bytes.length <= 4) {
    return null
  }
  const data = bytes.slice(0, bytes.length - 4)
  const vinfo = bytes.slice(bytes.length - 4, bytes.length)
  const hash1 = createHash('sha256')
  hash1.update(data)
  const sum1 = hash1.digest()
  const hash2 = createHash('sha256')
  hash2.update(sum1)
  const sum2 = hash2.digest()
  if (vinfo.toString() === sum2.slice(0, 4).toString()) {
    const pub = new PubKey(data)
    if (pub.isValid()) {
      return pub
    } else {
      return null
    }
  } else {
    return null
  }
}

class PrivKey {
  constructor (privKey) {
    this.data = privKey
  }
  isValid () {
    return secp256k1.privateKeyVerify(this.data)
  }
  toWIF () {
    if (!this.isValid()) {
      return ''
    }
    const hash1 = createHash('sha256')
    hash1.update(this.data)
    const sum1 = hash1.digest()
    const hash2 = createHash('sha256')
    hash2.update(sum1)
    const sum2 = hash2.digest()
    const data = Buffer.concat([Buffer.from([1]), this.data, sum2.slice(0, 4)])
    return bs58.encode(data)
  }
  pubKey () {
    if (!this.isValid()) {
      return null
    }
    const pubKeyData = secp256k1.publicKeyCreate(this.data)
    return new PubKey(pubKeyData)
  }
}

class PubKey {
  constructor (pubKey) {
    this.data = pubKey
  }
  isValid () {
    return secp256k1.publicKeyVerify(this.data)
  }
  toWIF () {
    const symbol = 'COS'
    const hash1 = createHash('sha256')
    hash1.update(this.data)
    const sum1 = hash1.digest()
    const hash2 = createHash('sha256')
    hash2.update(sum1)
    const sum2 = hash2.digest()
    const data = Buffer.concat([this.data, sum2.slice(0, 4)])
    return symbol + bs58.encode(data)
  }
}

// module.exports.PrivKey = PrivKey
// module.exports.PubKey = PubKey
module.exports.privKeyFromWIF = privKeyFromWIF
module.exports.pubKeyFromWIF = pubKeyFromWIF
module.exports.generatePrivKey = generatePrivKey
