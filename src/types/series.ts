import { FastifyRequest } from 'fastify';
import { ListMeta } from './meta.js';

interface BaseSeries {
  name: string;
  url: string | null;
}
interface Series extends BaseSeries {
  id: number;
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

type RequestCreateSeries = FastifyRequest<{ Body: BaseSeries }>;
type RequestUpdateSeries = FastifyRequest<{
  Querystring: { id: string };
  Body: BaseSeries;
}>;

export type {
  Series,
  BaseSeries,
  QuerySeries,
  SeriesResponse,
  RequestCreateSeries,
  RequestUpdateSeries,
};
