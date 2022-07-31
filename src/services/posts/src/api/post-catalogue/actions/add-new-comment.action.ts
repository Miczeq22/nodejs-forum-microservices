import { AddNewCommentCommand } from '@app/commands/add-new-comment/add-new-comment.command';
import { CommandBus } from '@myforum/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const addNewCommentActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      content: Joi.string().trim().required(),
    }),
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  },
  {
    abortEarly: false,
  },
);

const addNewCommentAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new AddNewCommentCommand({
          ...req.body,
          authorId: res.locals.context.accountId,
          postId: req.params.id,
        }),
      )
      .then((comment) => res.status(201).json(comment))
      .catch(next);

export default addNewCommentAction;
