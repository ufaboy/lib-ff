import { FastifyRequest } from 'fastify';
import { ListMeta } from './meta.js';

interface BaseAuthor {
  name: string;
  url: string | null;
}

interface Author extends BaseAuthor {
  id: number;
}

interface QueryAuthor {
  [key: string]: string | number | undefined;
  id?: number;
  name?: string;
  url?: string;
  sort: string;
  perPage: number;
  page: number;
}

interface AuthorResponse {
  items: Array<Author>;
  _meta: ListMeta;
}

type RequestCreateAuthor = FastifyRequest<{ Body: BaseAuthor }>;
type RequestUpdateAuthor = FastifyRequest<{ Querystring: { id: string }, Body: BaseAuthor }>;

export type {
  Author,
  BaseAuthor,
  QueryAuthor,
  AuthorResponse,
  RequestCreateAuthor,
  RequestUpdateAuthor
};
