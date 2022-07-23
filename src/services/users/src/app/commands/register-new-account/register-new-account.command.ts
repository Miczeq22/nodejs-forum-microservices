import { RegisterNewAccountPayload } from '@core/platform-registration/platform-registration.types';
import { Command } from '@myforum/building-blocks';

export class RegisterNewAccountCommand implements Command<RegisterNewAccountPayload> {
  constructor(public readonly payload: RegisterNewAccountPayload) {}
}
