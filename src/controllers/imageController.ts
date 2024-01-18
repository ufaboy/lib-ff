import { FastifyRequest, FastifyReply } from 'fastify';
import {
  removeImagesAll,
  viewImage,
  viewImageByName,
  updateImage,
  searchImage,
  removeImage,
  totalImageBooks,
} from '../services/imageService.js';
import { Image, QueryImages } from '../types/images.js';
import { RequestQueryID } from '../types/meta.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
type RequestImageByName = FastifyRequest<{ Querystring: { bookID: number, imageName:string } }>

async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QueryImages;
    const images = await searchImage(params);
    reply.send(images);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const image = await viewImage(Number(id));
    reply.send(image);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function viewByName(req: RequestImageByName, reply: FastifyReply) {
  try {
    const { bookID, imageName } = req.query;
    const image = await viewImageByName(Number(bookID), imageName);
    reply.send(image);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function upload(req: FastifyRequest, reply: FastifyReply) {
  try {
    const files = await req.files();
    // const result = await uploadImages(1, files);
    // reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.params as Image;
    const image = await updateImage(data);
    reply.send(image);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.query as { id: string };
    const image = await removeImage(Number(id));
    reply.send(image);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function removAll(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { bookId } = req.query as { bookId: string };
    const result = await removeImagesAll(Number(bookId));
    reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function total(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await totalImageBooks();
    reply.send(result);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, viewByName, upload, update, remove, removAll, total };
