import { Global, Module } from '@nestjs/common';
import { TemporalService } from './services/temporal.service';

@Global()
@Module({
  providers: [TemporalService],
  exports: [TemporalService],
})
export class TemporalModule {}
