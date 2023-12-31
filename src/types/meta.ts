import { FastifyRequest } from 'fastify';

interface ListMetaLinks {
  first: {
    href: string;
  };
  last: {
    href: string;
  };
  next: {
    href: string;
  };
  self: {
    href: string;
  };
  prev: {
    href: string;
  };
}

interface ListMeta {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

interface RequestFormField {
  [x: string]: any;
  type: string;
  fieldname: string;
  mimetype: string;
  encoding: string;
  value: string;
  fieldnameTruncated: boolean;
  valueTruncated: boolean;
  fields: [Object];
}

type RequestQueryID = FastifyRequest<{ Querystring: { id: string } }>

export type { ListMetaLinks, ListMeta, RequestFormField, RequestQueryID };
