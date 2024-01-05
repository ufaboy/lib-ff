import { Book } from './book.js';
import { ListMeta } from './meta.js';

interface Image {
  id: number;
//   book_id: number;
  book: {id: number, name: string} | null;
  path: string;
  file_name: string;
}

interface QueryImages {
  [key: string]: string | number | undefined;
  id?: number;
  book_id?: number;
  bookName?: string;
  path?: string;
  file_name?: string;
  sort: string;
  perPage?: number;
  page?: number;
  expand?: string;
}
interface ImagesResponse {
  items: Array<Image>;
  _meta: ListMeta;
}

interface ImageFromDB {
  id: number;
  file_name: string;
  path: string;
  book_id: number;
  book?: {
    id: number;
    name: string;
  };
}

export type { Image, ImageFromDB, QueryImages, ImagesResponse };
