import { NewAccountRegisteredEvent } from '@app/integration-events/users/new-account-registered.event';
import { Mailer } from '@infrastructure/mailer/mailer.service';
import { EventSubscriber, Logger } from '@myforum/building-blocks';

interface Dependencies {
  logger: Logger;
  mailer: Mailer;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = 'NewAccountRegisteredEvent';

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: NewAccountRegisteredEvent): Promise<void> {
    this.dependencies.logger.info(`Sending e-mail notification to "${event.payload.accountEmail}"`);

    this.dependencies.mailer.sendMail({
      // TODO: Send proper payload
      payload: {
        link: 'https://google.com',
        username: 'John Doe',
      },
      subject: 'Welcome to MyForum!',
      template: 'activate-account',
      to: event.payload.accountEmail,
    });
  }
}
