import { ListMeta } from './meta.js';

interface Media {
  id: number;
//   book_id: number;
  book: {id: number, name: string} | null;
  path: string;
  file_name: string;
}

interface QueryMedia {
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
interface MediaResponse {
  items: Array<Media>;
  _meta: ListMeta;
}

interface MediaFromDB {
  id: number;
  file_name: string;
  path: string;
  book_id: number;
  book?: {
    id: number;
    name: string;
  };
}

interface StorageMedia {
  bookID: number;
  media: string[];
}

export type { Media, MediaFromDB, QueryMedia, MediaResponse, StorageMedia };
