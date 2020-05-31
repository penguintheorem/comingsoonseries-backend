import { PaginationMetadata } from './pagination-metadata';

export interface ResultsWithPagination<T> {
  items: T[];
  paginationInfo: PaginationMetadata;
}
