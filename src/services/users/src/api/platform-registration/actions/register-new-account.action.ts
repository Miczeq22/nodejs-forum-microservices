import { RegisterNewAccountCommand } from '@app/commands/register-new-account/register-new-account.command';
import { CommandBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { RegisterNewAccountPayload } from '@core/platform-registration/platform-registration.types';

interface Dependencies {
  commandBus: CommandBus;
}

export const registerNewAccountActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object<RegisterNewAccountPayload>().keys({
      email: Joi.string().email().required(),
      password: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

const registerNewAccountAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new RegisterNewAccountCommand(req.body))
      .then(() => res.sendStatus(201))
      .catch(next);

export default registerNewAccountAction;
