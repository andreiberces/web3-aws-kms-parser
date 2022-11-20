import { Injectable } from '@nestjs/common'
import { KMS } from 'aws-sdk'
import { ethers } from 'ethers'
import * as asn1 from 'asn1.js'

@Injectable()
export class ParserService {
  async provider() {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.ALCHEMY_URL,
    )
    return provider
  }

  async getPublicKey(params: any) {
    const kms = new KMS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
    console.log(kms)
    console.log(process.env.AWS_REGION)
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
    const address = ethers.utils.keccak256(pubKeyBuffer)
    const buf2 = Buffer.from(address, 'hex')
    const walletAddress = '0x' + buf2.slice(-20).toString('hex')
    console.log('Generated address: ' + walletAddress)
    return { walletAddress: walletAddress }
  }
}
