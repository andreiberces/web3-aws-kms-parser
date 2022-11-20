import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetWalletAddressDocDecorator } from '../../data/swagger/parser-doc.decorator'
import { ParserService } from './parser.service'

@ApiTags('Parser')
@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @GetWalletAddressDocDecorator()
  @Get('wallet-address/:keyId')
  async getWalletAddress(@Param('keyId') keyId: string) {
    const response = await this.parserService.getWalletAddress(keyId)
    return { data: response }
  }
}
