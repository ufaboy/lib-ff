import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createSeries,
  viewSeries,
  updateSeries,
  searchSeries,
  removeSeries,
} from '../services/seriesService.js';
import { Series, QuerySeries } from '../types/series.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function search(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const params = req.query as QuerySeries;
    const series = await searchSeries(params);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function view(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: number };
    const series = await viewSeries(id);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { name, url } = req.params as Series;
    const series = await createSeries({ name, url });
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.params as Series;
    const series = await updateSeries(data);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: number };
    const series = await removeSeries(id);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, create, update, remove };
