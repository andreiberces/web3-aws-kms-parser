import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ParserModule } from './modules/parser/parser.module'
import { SignerModule } from './modules/signer/signer.module'

@Module({
  imports: [ConfigModule.forRoot(), ParserModule, SignerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
