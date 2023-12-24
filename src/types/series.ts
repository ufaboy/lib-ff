import { ListMeta } from './meta.js';

interface Series {
  id?: number;
  name: string;
  url: string;
}

interface QuerySeries {
  [key: string]: string | number | undefined;
  id?: number;
  name?: string;
  url?: string;
  sort: string;
  perPage: number;
  page: number;
}

interface SeriesResponse {
  items: Array<Series>;
  _meta: ListMeta;
}

export type { Series, QuerySeries, SeriesResponse };
