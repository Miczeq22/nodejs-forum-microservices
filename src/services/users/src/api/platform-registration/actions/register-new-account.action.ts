import { RegisterNewAccountCommand } from '@app/commands/register-new-account/register-new-account.command';
import { CommandBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { RegisterNewAccountPayload } from '@core/platform-registration/platform-registration.types';

interface Dependencies {
  commandBus: CommandBus;
}

export const registerNewAccountActionValidation: RequestHandler = celebrate(
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

/**
 * @openapi
 *
 * /v1/platform-registration:
 *   post:
 *     tags:
 *        - Users
 *     summary:
 *       This endpoint allows to register new account.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#components/schemas/RegisterNewAccount'
 *     responses:
 *       201:
 *        description: Account registered successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const registerNewAccountAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new RegisterNewAccountCommand(req.body))
      .then((tokens) => res.status(201).json(tokens))
      .catch(next);

export default registerNewAccountAction;
