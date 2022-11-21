import { Injectable } from '@nestjs/common'
import { KMS } from 'aws-sdk'
import * as asn1 from 'asn1.js'
import { keccak256 } from 'js-sha3'
@Injectable()
export class ParserService {
  async getPublicKey(params: any) {
    const kms = new KMS({
      accessKeyId: process.env.AWS_ACCESS_KEY_IDD,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEYY,
      region: process.env.AWS_REGIONN,
    })
    return kms.getPublicKey(params).promise()
  }

  EcdsaPubKey = asn1.define('EcdsaPubKey', function (this) {
    this.seq().obj(
      this.key('algo').seq().obj(this.key('a').objid(), this.key('b').objid()),
      this.key('pubKey').bitstr(),
    )
  })

  async getWalletAddress(keyId: string) {
    const params = {
      KeyId: keyId,
    }
    const publicKey = await this.getPublicKey(params)
    let result = this.EcdsaPubKey.decode(publicKey.PublicKey, 'der')
    let pubKeyBuffer = result.pubKey.data
    pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length)
    const address = keccak256(pubKeyBuffer)
    const buf2 = Buffer.from(address, 'hex')
    const walletAddress = '0x' + buf2.slice(-20).toString('hex')
    console.log('Generated address: ' + walletAddress)
    return { walletAddress: walletAddress }
  }
}
