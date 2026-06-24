import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './modules/client/client.module';
import { OpportunityModule } from './modules/opportunity/opportunity.module';

@Module({
  imports: [PrismaModule, ClientModule, OpportunityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
