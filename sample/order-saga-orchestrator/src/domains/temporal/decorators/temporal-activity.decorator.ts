import {
  TEMPORAL_ACTIVITY,
  TEMPORAL_ACTIVITY_OPTIONS,
} from './constants/temporal.constant';

export const activitiesRegistry = new Map<string, any>();

export function Activities(options: {
  taskQueue: string;
  workflowPath: string;
}): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(TEMPORAL_ACTIVITY_OPTIONS, options, target);

    activitiesRegistry.set(target.name, target);

    return target;
  };
}

export function Activity(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const activities =
      Reflect.getMetadata(TEMPORAL_ACTIVITY, target.constructor) || {};

      activities[propertyKey] = descriptor.value;

    Reflect.defineMetadata(TEMPORAL_ACTIVITY, activities, target.constructor);
  };
}
