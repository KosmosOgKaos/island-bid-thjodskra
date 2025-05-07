import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { NationalRegistryController } from './national-registry/national-registry.controller';
import { NationalRegistryService } from './national-registry/national-registry.service';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [NationalRegistryController],
  providers: [PrismaService, NationalRegistryService],
})
export class AppModule {}
