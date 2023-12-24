import type { Tag } from './tag.js';
import type { Author } from './author.js';
import type { ListMeta } from './meta.js';
import type { Image } from './images.js';
import type { Series } from './series.js';

interface Book {
	[key: string]: string | number | undefined | Author | Series | Tag[] | Image[];
	id?: number;
	name: string;
	description?: string;
	text?: string;
	source?: string;
	rating?: number;
	author?: Author;
	series?: Series;
	tags: Array<Tag>;
	cover?: string;
	bookmark?: number;
	text_length?: number;
	view_count?: number;
	created_at?: number;
	updated_at?: number;
	last_read?: number;
	images?: Image[];
}
interface BookRaw {
	id?: number;
	name: string;
	description?: string;
	text?: string;
	source?: string;
	rating?: number;
	author_id?: number;
	series_id?: number;
	tag_ids: Array<number>;
	cover?: string;
	bookmark?: number;
	images?: Array<number>;
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

export type { Book, BookRaw, BookResponse, QueryBooks, ExpandParams };
