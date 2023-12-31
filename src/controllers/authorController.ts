import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createAuthor,
  viewAuthor,
  updateAuthor,
  searchAuthor,
  removeAuthor,
} from '../services/authorService.js';
import { QueryAuthor, RequestCreateAuthor, RequestUpdateAuthor } from '../types/author.js';
import { RequestQueryID } from '../types/meta.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QueryAuthor;
    const authors = await searchAuthor(params);
    reply.send(authors);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const author = await viewAuthor(Number(id));
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: RequestCreateAuthor, reply: FastifyReply) {
  try {
    const author = await createAuthor(req.body);
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: RequestUpdateAuthor, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const author = await updateAuthor(Number(id), req.body);
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const author = await removeAuthor(Number(id));
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, create, update, remove };
