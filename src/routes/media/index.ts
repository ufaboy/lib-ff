import path from "path";
import { FastifyPluginAsync } from "fastify"
import { search, view, viewByName, update, remove, removAll, total } from '../../controllers/mediaController.js'

const series: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:book/:file', (req, res)=> {
    const book = req.params as string
    const file = req.params as string
    console.log('req media', book, file)
    const filePath = path.join(__dirname, `storage/media/${book}/${file}`);
    res.sendFile(filePath);
  });
  fastify.get('/', search);
  fastify.get('/view', view);
  fastify.get('/view-by-name', viewByName);
  fastify.post('/update', update);
  fastify.delete('/delete', remove);
  fastify.delete('/delete-all', removAll);
  fastify.get('/total', total);
}

export default series;
