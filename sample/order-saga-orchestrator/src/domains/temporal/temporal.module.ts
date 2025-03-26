import { Global, Module } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';
import { NativeConnection } from '@temporalio/worker';
import {
  TEMPORAL_CLIENT_INJECTOR_TOKEN,
  TEMPORAL_CONNECTION_INJECTOR_TOKEN,
} from './decorators/constants/temporal.constant';
import { TemporalExplorerService } from './services/temporal-explorer.service';

@Global()

@Module({
  providers: [
    TemporalExplorerService,
    {
      provide: TEMPORAL_CLIENT_INJECTOR_TOKEN,
      useFactory: async () => {
        const connection = await Connection.connect();

        return new Client({ connection });
      },
    },
    {
      provide: TEMPORAL_CONNECTION_INJECTOR_TOKEN,
      useFactory: async () => {
        return await NativeConnection.connect();
      },
    },
  ],
  exports: [TEMPORAL_CLIENT_INJECTOR_TOKEN, TEMPORAL_CONNECTION_INJECTOR_TOKEN],
})
export class TemporalModule {}
