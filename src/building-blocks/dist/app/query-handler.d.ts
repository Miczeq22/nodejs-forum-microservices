import { Query } from './query';
export declare const DEFAULT_PAGE = 1;
export declare const DEFAULT_ITEMS_PER_PAGE = 20;
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
export declare const serializeDataToPaginatedResponse: <DataType>(data: DataType[], total: number, page: number, itemsPerPage: number) => PaginatedResponse<DataType>;
export interface QueryHandler<QueryType extends Query<any>, ResultType extends object> {
    handle(query: QueryType): Promise<ResultType>;
}
