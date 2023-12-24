import { ListMeta } from './meta.js';

interface Author {
	id?: number;
	name: string;
	url: string;
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

export type { Author, QueryAuthor, AuthorResponse };
