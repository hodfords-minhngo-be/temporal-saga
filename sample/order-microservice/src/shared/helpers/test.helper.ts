import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '~app.module';

export class TestHelper {
  public app: INestApplication;
  public moduleFixture: TestingModule;
  public httpService: any;

  async initialize(
    overrideBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
  ): Promise<void> {
    let moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    if (overrideBuilder) {
      moduleBuilder = overrideBuilder(moduleBuilder);
    }
    this.moduleFixture = await moduleBuilder.compile();

    this.app = this.moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe());

    await this.app.init();

    this.httpService = this.app.getHttpServer();
  }

  async getService<T>(service: new (...args: any[]) => T): Promise<T> {
    return this.moduleFixture.get(service);
  }

  async close(): Promise<void> {
    this.app.flushLogs();
    await this.app.close();
  }

  async getAccessToken(): Promise<string> {
    const response = await this.post('/auth/sign-up').send({
      email: 'test@gmail.com',
      password: 'password',
    });

    return response.body.accessToken;
  }

  get(url: string): request.Test {
    return request(this.httpService).get(url);
  }

  post(url: string): request.Test {
    return request(this.httpService).post(url);
  }
}
