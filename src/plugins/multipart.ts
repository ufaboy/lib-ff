import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';
import { uploadImage as onFile } from '../services/imageService.js';

export default fp(async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fields: 25,
      files: 333,
      fileSize: 10485760,
      fieldSize: 10485760
    },
    attachFieldsToBody: true,
    onFile,
  });
});
