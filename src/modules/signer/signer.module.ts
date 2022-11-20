import { Module } from '@nestjs/common';
import { SignerService } from './signer.service';
import { SignerController } from './signer.controller';

@Module({
  providers: [SignerService],
  controllers: [SignerController]
})
export class SignerModule {}
