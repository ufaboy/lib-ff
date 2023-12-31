import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createSeries,
  viewSeries,
  updateSeries,
  searchSeries,
  removeSeries,
} from '../services/seriesService.js';
import {
  Series,
  QuerySeries,
  RequestCreateSeries,
  RequestUpdateSeries,
} from '../types/series.js';
import { RequestQueryID } from '../types/meta.js';

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
async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const series = await viewSeries(Number(id));
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function create(req: RequestCreateSeries, reply: FastifyReply) {
  try {
    const series = await createSeries(req.body);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function update(req: RequestUpdateSeries, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const series = await updateSeries(Number(id), req.body);
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function remove(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const series = await removeSeries(Number(id));
    reply.send(series);
  } catch (error) {
    reply.code(404).send(error);
  }
}

export { search, view, create, update, remove };
