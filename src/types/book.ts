import type { BookTagShrink, Tag } from './tag.js';
import type { Author } from './author.js';
import type { ListMeta, RequestFormField } from './meta.js';
import type { Image, ImageFromDB } from './images.js';
import type { Series } from './series.js';
import { FastifyRequest } from 'fastify';
import fastifyMultipart from '@fastify/multipart';

interface BaseBook {
  name: string;
  description: string | null;
  text: string | null;
  source: string | null;
  rating: number | null;
  author_id: number | null;
  series_id: number | null;
  tag_ids: Array<number>;
  cover: string | null;
}
interface Book {
  [key: string]: string | number | null | Author | Series | Tag[] | Image[];
  id: number;
  name: string;
  description: string | null;
  text: string | null;
  source: string | null;
  rating: number | null;
  author: Author | null;
  series: Series | null;
  tags: Array<Tag> | null;
  cover: string | null;
  images: Array<Image> | null;
  text_length: number | null;
  view_count: number | null;
  updated_at: number | null;
  last_read: number | null;
}

interface BookResponse {
  items: Book[];
  _meta: ListMeta;
  _links: MetaLinks;
}

interface MetaLinks {
  first: { href: string };
  last: { href: string };
  next: { href: string };
  self: { href: string };
}

interface QueryBooks {
  [key: string]: string | number | undefined;
  id?: number;
  tag?: string;
  view_count?: number;
  name?: string;
  text?: string;
  rating?: number;
  text_length?: number;
  authorName?: string;
  seriesName?: string;
  size?: string;
  updated_at?: number;
  last_read?: number;
  sort: string;
  perPage: number;
  page: number;
}

type ExpandParams = Record<string, boolean | { select: { tag: boolean } }>;

interface BookUpdateForm {
  'Book[name]': RequestFormField;
  'Book[description]': RequestFormField;
  'Book[tag_ids][]': RequestFormField | RequestFormField[];
  'Book[cover]': RequestFormField;
  'Book[source]': RequestFormField;
  'Book[author_id]': RequestFormField;
  'Book[series_id]': RequestFormField;
  'Book[rating]': RequestFormField;
  'Book[text]': RequestFormField;
  'Upload[imageFiles][]': AsyncIterableIterator<fastifyMultipart.MultipartFile> | fastifyMultipart.MultipartFile;
}
interface BookUpdateModel {
  name: string;
  description: string | null;
  tag_ids: Array<number>;
  source: string | null;
  cover: string | null;
  text: string | null;
  author_id: number | null;
  series_id: number | null;
  rating: number | null;
}

interface BookFromDB {
  book_tag: Array<BookTagShrink> | null;
  id: number;
  name: string;
  description: string | null;
  source: string | null;
  rating: number | null;
  cover: string | null;
  series: Series | null;
  author: Author | null;
  text?: string | null;
  image?: Array<ImageFromDB> | null;
  text_length: number | null;
  view_count: number;
  updated_at: number | null;
  last_read: number | null;
}


type BookCreateRequest = FastifyRequest<{ Body: BookUpdateForm }>;
type BookUpdateRequest = FastifyRequest<{
  Querystring: { id: string };
  Body: BookUpdateForm;
}>;

export type {
  Book,
  BaseBook,
  BookFromDB,
  BookResponse,
  QueryBooks,
  ExpandParams,
  BookCreateRequest,
  BookUpdateRequest,
  BookUpdateForm,
  BookUpdateModel,
};
