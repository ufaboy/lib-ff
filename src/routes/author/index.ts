import { FastifyPluginAsync } from "fastify"
import { search, view, create, update, remove } from '../../controllers/authorController.js'

const author: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.post('/create', create);
  fastify.put('/update', update);
  fastify.delete('/delete', remove);
}

export default author;
