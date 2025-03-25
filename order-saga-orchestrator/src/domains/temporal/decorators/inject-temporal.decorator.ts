import { Inject } from '@nestjs/common';
import {
  TEMPORAL_CLIENT_INJECTOR_TOKEN,
  TEMPORAL_CONNECTION_INJECTOR_TOKEN,
} from './constants/temporal.constant';

export const InjectTemporalClient = (): ParameterDecorator =>
  Inject(TEMPORAL_CLIENT_INJECTOR_TOKEN);
export const InjectTemporalConnection = (): ParameterDecorator =>
  Inject(TEMPORAL_CONNECTION_INJECTOR_TOKEN);
