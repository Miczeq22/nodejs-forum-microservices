import { Query } from './query';

export const DEFAULT_PAGE = 1;

export const DEFAULT_ITEMS_PER_PAGE = 20;

export interface PaginatedQuery {
  page?: number;
  itemsPerPage?: number;
}

export interface PaginatedResponse<DataType> {
  data: DataType[];
  total: number;
  currentPage: number;
  maxPages: number;
  itemsPerPage: number;
}

export const serializeDataToPaginatedResponse = <DataType>(
  data: DataType[],
  total: number,
  page: number,
  itemsPerPage: number,
): PaginatedResponse<DataType> => ({
  data,
  total: Number(total),
  itemsPerPage: Number(itemsPerPage),
  currentPage: Number(page),
  maxPages: Math.ceil(Number(total) / Number(itemsPerPage)),
});

export interface QueryHandler<QueryType extends Query<any>, ResultType extends object> {
  handle(query: QueryType): Promise<ResultType>;
}
