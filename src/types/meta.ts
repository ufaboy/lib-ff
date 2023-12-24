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

export type { ListMetaLinks, ListMeta };
