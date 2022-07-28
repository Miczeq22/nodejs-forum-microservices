import { LoginCommand, LoginCommandPayload } from '@app/commands/login/login.command';
import { CommandBus } from '@myforum/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const loginActionValidation: RequestHandler = celebrate(
  {
    [Segments.BODY]: Joi.object<LoginCommandPayload>().keys({
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

const loginAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new LoginCommand(req.body))
      .then((tokens) => res.status(200).json(tokens))
      .catch(next);

export default loginAction;
