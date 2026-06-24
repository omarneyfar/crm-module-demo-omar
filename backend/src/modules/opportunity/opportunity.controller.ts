import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpportunityService } from './opportunity.service';
@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  //TODO
}
