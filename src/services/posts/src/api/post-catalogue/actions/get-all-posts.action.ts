import { GetAllPostsQuery } from '@app/queries/get-all-posts/get-all-posts.query';
import { QueryBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

const getAllPostsAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(new GetAllPostsQuery())
      .then((posts) => res.status(200).json(posts))
      .catch(next);

export default getAllPostsAction;
