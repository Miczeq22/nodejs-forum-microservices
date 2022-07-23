import { CreateNewPostCommand } from '@app/commands/create-new-post/create-new-post.command';
import { CommandBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

interface Dependencies {
  commandBus: CommandBus;
}

export const createNewPostActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().trim().required(),
      content: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

const createNewPostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new CreateNewPostCommand({ ...req.body, authorId: '#author-id' }))
      .then((post) => res.status(201).json(post))
      .catch(next);

export default createNewPostAction;
