export class PaginatedResponse <T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}
