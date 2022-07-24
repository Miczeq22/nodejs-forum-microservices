import { Command } from '@myforum/building-blocks';

export interface LoginCommandPayload {
  email: string;
  password: string;
}

export class LoginCommand implements Command<LoginCommandPayload> {
  constructor(public readonly payload: LoginCommandPayload) {}
}
