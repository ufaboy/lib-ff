import { FastifyPluginAsync } from "fastify"
import { search, view, update, remove, removAll, total } from '../../controllers/imageController.js'

const author: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.post('/update', update);
  fastify.delete('/delete', remove);
  fastify.delete('/delete-all', removAll);
  fastify.get('/total', total);
}

export default author;
