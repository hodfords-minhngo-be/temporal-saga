import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';

@Injectable()
export class TemporalService implements OnApplicationBootstrap {
  private client: Client;

  async onApplicationBootstrap() {
    const connection = await Connection.connect();
    this.client = new Client({ connection });
  }

  getClient(): Client {
    return this.client;
  }
}
