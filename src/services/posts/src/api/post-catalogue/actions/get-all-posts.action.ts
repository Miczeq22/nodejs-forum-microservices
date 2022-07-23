import { GetAllPostsQuery } from '@app/queries/get-all-posts/get-all-posts.query';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE, QueryBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

const getAllPostsAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetAllPostsQuery({
          page: Number(req.query.page || DEFAULT_PAGE),
          itemsPerPage: Number(req.query.itemsPerPage || DEFAULT_ITEMS_PER_PAGE),
        }),
      )
      .then((posts) => res.status(200).json(posts))
      .catch(next);

export default getAllPostsAction;
