import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createAuthor,
  viewAuthor,
  updateAuthor,
  searchAuthor,
  removeAuthor,
} from '../services/authorService.js';
import { Author, QueryAuthor } from '../types/author.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QueryAuthor
    const authors = await searchAuthor(params);
    reply.send(authors);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {id} = req.params as {id: number}
    const author = await viewAuthor(id);
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {name, url} = req.params as Author
    const author = await createAuthor({name, url});
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.params as Author
    const author = await updateAuthor(data);
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {id} = req.params as {id: number}
    const author = await removeAuthor(id);
    reply.send(author);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, create, update, remove };
