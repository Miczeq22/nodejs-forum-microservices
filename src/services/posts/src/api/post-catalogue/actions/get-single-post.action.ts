import { GetSinglePostQuery } from '@app/queries/get-single-post/get-single-post.query';
import { QueryBus } from '@myforum/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

const getSinglePostAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetSinglePostQuery({
          id: req.params.id,
        }),
      )
      .then((post) => res.status(200).json(post))
      .catch(next);

export default getSinglePostAction;
