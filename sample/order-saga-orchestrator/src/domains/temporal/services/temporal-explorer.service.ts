import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Worker, WorkerOptions } from '@temporalio/worker';
import {
  TEMPORAL_ACTIVITY,
  TEMPORAL_ACTIVITY_OPTIONS,
} from '../decorators/constants/temporal.constant';
import { activitiesRegistry } from '../decorators/temporal-activity.decorator';

@Injectable()
export class TemporalExplorerService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private workers: Worker[] = [];

  constructor(private moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    try {
      for (const worker of this.workers) {
        worker.shutdown();
      }
    } catch (err: any) {}
  }

  async onApplicationBootstrap() {
    await this.exploreAndRegisterWorker();
  }

  private async exploreAndRegisterWorker() {
    const activityClasses = activitiesRegistry.values();
    for (const activityClass of activityClasses) {
      const activityOpts = Reflect.getMetadata(
        TEMPORAL_ACTIVITY_OPTIONS,
        activityClass,
      );
      const target = this.moduleRef.get(activityClass, { strict: false });
      const activities = this.getActivities(activityClass, target);

      if (!activities) {
        continue;
      }

      await this.registerActivityWorker(activityOpts, activities);
    }
  }

  private getActivities(activityClass: Object, target: any) {
    const activities = Reflect.getMetadata(TEMPORAL_ACTIVITY, activityClass);

    for (const [key, value] of Object.entries(activities)) {
      activities[key] = (value as Function).bind(target);
    }

    return activities;
  }

  private async registerActivityWorker(
    activityOpts: {
      taskQueue: string;
      workflowPath: string;
    },
    activities: any,
  ) {
    const opts: WorkerOptions = {
      taskQueue: activityOpts.taskQueue,
      workflowsPath: activityOpts.workflowPath,
      activities,
    };
    const worker = await Worker.create(opts);
    this.workers.push(worker);
    worker.run();
  }
}
