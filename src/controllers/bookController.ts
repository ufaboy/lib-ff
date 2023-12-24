import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createBook,
  viewBook,
  updateBook,
  searchBook,
  removeBook,
} from '../services/bookService.js';
import { Book, BookRaw, ExpandParams, QueryBooks } from '../types/book.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QueryBooks;
    const books = await searchBook(params);
    reply.send(books);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id, expand } = getQuery(req.query);
    const params = getExpandParams(expand);
    const book = await viewBook(id, params);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.params as BookRaw;
    const book = await createBook(data);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { expand } = getQuery(req.query);
    const params = getExpandParams(expand);
    const data = req.params as Book;
    const book = await updateBook(data, params);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: number };
    const book = await removeBook(id);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}
function getQuery(query: unknown) {
  const { id, expand } = query as { id?: string; expand?: string };
  return { id: Number(id), expand };
}
function getExpandParams(expand?: string) {
  return expand
    ? expand.split(',').reduce((acc, key) => {
        if (key === 'tags') {
          acc.book_tag = {
            select: {
              tag: true,
            },
          };
        } else {
          acc[key] = true;
        }
        return acc;
      }, {} as ExpandParams)
    : {};
}
export { search, view, create, update, remove };
