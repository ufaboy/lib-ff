import { FastifyRequest } from "fastify";

interface BaseTag {
  name: string;
  description?: string;
}
interface Tag {
  id: number;
  name: string;
  description: string | null;
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

type RequestCreateTag = FastifyRequest<{ Body: BaseTag }>;
type RequestUpdateTag = FastifyRequest<{ Querystring: { id: string }, Body: BaseTag }>;

export type { Tag, BookTag, BookTagJunc, BaseTag, BookTagShrink, RequestCreateTag, RequestUpdateTag };
