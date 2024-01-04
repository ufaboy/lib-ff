import { FastifyPluginAsync } from "fastify"
import path from "path";

const series: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:book/:file', (req, res)=> {
    const book = req.params as string
    const file = req.params as string
    console.log('req image', book, file)
    const filePath = path.join(__dirname, `storage/media/${book}/${file}`);
    res.sendFile(filePath);
  });
}

export default series;
