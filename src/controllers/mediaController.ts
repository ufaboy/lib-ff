import { FastifyRequest, FastifyReply } from 'fastify';
import {
  removeMediaAll,
  viewMedia,
  viewMediaByName,
  updateMedia,
  searchMedia,
  removeMedia,
  totalMediaBooks,
} from '../services/mediaService.js';
import { Media, QueryMedia } from '../types/media.js';
import { RequestQueryID } from '../types/meta.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
type RequestMediaByName = FastifyRequest<{ Querystring: { bookID: number, mediaName:string } }>

async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QueryMedia;
    const mediaList = await searchMedia(params);
    reply.send(mediaList);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const media = await viewMedia(Number(id));
    reply.send(media);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function viewByName(req: RequestMediaByName, reply: FastifyReply) {
  try {
    const { bookID, mediaName } = req.query;
    const media = await viewMediaByName(Number(bookID), mediaName);
    reply.send(media);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function upload(req: FastifyRequest, reply: FastifyReply) {
  try {
    const files = await req.files();
    // const result = await uploadMedias(1, files);
    // reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.params as Media;
    const media = await updateMedia(data);
    reply.send(media);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.query as { id: string };
    const media = await removeMedia(Number(id));
    reply.send(media);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function removAll(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { bookId } = req.query as { bookId: string };
    const result = await removeMediaAll(Number(bookId));
    reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function total(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await totalMediaBooks();
    reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, viewByName, upload, update, remove, removAll, total };
