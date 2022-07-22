import { CreateNewPostCommand } from '@app/commands/create-new-post/create-new-post.command';
import { CommandBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

const createNewPostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new CreateNewPostCommand(req.body))
      .then((post) => res.status(201).json(post))
      .catch(next);

export default createNewPostAction;
