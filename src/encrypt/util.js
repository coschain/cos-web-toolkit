import crc32 from 'crc/crc32';
const bigInt = require('big-integer')

const sdk = require('cos-grpc-js')

export function parsePrivateKeyWIF(privkey) {
  const callerPriv = sdk.crypto.privKeyFromWIF(privkey)
  if (callerPriv === null) {
    console.log('priv from wif failed')
    return null
  }
  return callerPriv
}

export const bytes2BigEndUint32 = function (byteArray) {
  return (byteArray[3] | byteArray[2] << 8 | byteArray[1] << 16 | byteArray[0] << 24) >>> 0
}

export const generateUUID = (content) => {
  let randContent = content + Math.random() * 1e5
  let c = Math.abs(crc32(randContent))
  // return (bigInt(Date.now()) * BigInt(1e6) + BigInt(c)).toString()
  return bigInt(Date.now()).multiply(bigInt(1e6)).add(bigInt(c)).toString()
}
