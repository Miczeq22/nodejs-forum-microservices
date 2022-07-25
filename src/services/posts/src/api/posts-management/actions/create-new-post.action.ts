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

/**
 * @openapi
 *
 * /v1/posts-management:
 *   post:
 *     tags:
 *        - Posts
 *     summary:
 *       This endpoint allows to create new post.
 *     responses:
 *       201:
 *        description: Post created successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const createNewPostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new CreateNewPostCommand({ ...req.body, authorId: res.locals.context.accountId }))
      .then((post) => res.status(201).json(post))
      .catch(next);

export default createNewPostAction;
