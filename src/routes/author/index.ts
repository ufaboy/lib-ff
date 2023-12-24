import { FastifyPluginAsync } from "fastify"
import { search, view, create, update, remove } from '../../controllers/authorController.js'

const author: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.post('/create', create);
  fastify.post('/update', update);
  fastify.post('/delete', remove);
}

export default author;
