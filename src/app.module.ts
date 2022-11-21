import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ParserModule } from './modules/parser/parser.module'

@Module({
  imports: [ConfigModule.forRoot(), ParserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
