import { FastifyPluginAsync } from "fastify"
import { search, view, viewByName, update, remove, removAll, total } from '../../controllers/mediaController.js'

const author: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.get('/view-by-name', viewByName);
  fastify.post('/update', update);
  fastify.delete('/delete', remove);
  fastify.delete('/delete-all', removAll);
  fastify.get('/total', total);
}

export default author;
