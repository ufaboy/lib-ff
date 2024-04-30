import { FastifyPluginAsync } from "fastify"
import { search, view, read, create, update, remove } from '../../controllers/bookController.js'

const series: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.get('/read', read);
  fastify.post('/create', create);
  fastify.post('/update', update);
  fastify.delete('/delete', remove);
}

export default series;
