import { Module } from '@nestjs/common';
import { TaxReturnController } from './tax-return/tax-return.controller';
import { TaxReturnService } from './tax-return/tax-return.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [TaxReturnController],
  providers: [TaxReturnService, PrismaService],
})
export class AppModule {}
