import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createTag,
  viewTag,
  updateTag,
  searchTag,
  removeTag,
} from '../services/tagService.js';
import { RequestQueryID } from '../types/meta.js';
import { RequestCreateTag, RequestUpdateTag } from '../types/tag.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const { sort } = req.query as { sort: string };
    const tags = await searchTag({ sort });
    reply.send(tags);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const tag = await viewTag(Number(id));
    reply.send(tag);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: RequestCreateTag, reply: FastifyReply) {
  try {
    const { name } = req.params as { name: string };
    const tag = await createTag(name);
    reply.send(tag);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: RequestUpdateTag, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const tag = await updateTag(Number(id), req.body);
    reply.send(tag);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: number };
    const tag = await removeTag(id);
    reply.send(tag);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, create, update, remove };
