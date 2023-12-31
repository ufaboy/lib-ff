interface Tag {
  id: number;
  name: string;
  description: string | null;
}
interface TagRaw {
  id?: number;
  name: string;
  description?: string;
}

interface BookTagJunc {
  book_id: number | null;
  tag_id: number | null;
}

interface BookTag extends BookTagJunc {
  tag: Tag | null;
}

interface BookTagShrink {
  tag: Tag
}

export type { Tag, BookTag, BookTagJunc, TagRaw, BookTagShrink };
