import { FastifyPluginAsync } from "fastify"
import { search, view, update, remove, total } from '../../controllers/imageController.js'

const author: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.post('/update', update);
  fastify.post('/delete', remove);
  fastify.get('/total', total);
}

export default author;
