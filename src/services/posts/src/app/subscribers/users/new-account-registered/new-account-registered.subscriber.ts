import { NewAccountRegisteredEvent } from '@app/integration-events/users/new-account-registered.event';
import { EventSubscriber, Logger } from '@myforum/building-blocks';

interface Dependencies {
  logger: Logger;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = 'NewAccountRegisteredEvent';

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: NewAccountRegisteredEvent): Promise<void> {
    this.dependencies.logger.info(`New account registered with id: "${event.payload.accountId}"`);
  }
}
