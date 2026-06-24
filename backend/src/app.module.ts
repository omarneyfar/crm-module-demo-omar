import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './modules/client/client.module';
import { OpportunityModule } from './modules/opportunity/opportunity.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

@Module({
  imports: [PrismaModule, ClientModule, OpportunityModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
