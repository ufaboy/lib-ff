import { FastifyRequest, FastifyReply } from 'fastify';
import {
  uploadImages,
  viewImage,
  updateImage,
  searchImage,
  removeImage,
} from '../services/imageService.js';
import { Image, QueryImages } from '../types/images.js';
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
async function upload(req: FastifyRequest, reply: FastifyReply) {
  try {
    console.log('upload', { req: req });
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
    const { id } = req.params as { id: number };
    const image = await removeImage(id);
    reply.send(image);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, upload, update, remove };
