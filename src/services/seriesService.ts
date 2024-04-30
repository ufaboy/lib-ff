import { PrismaClient } from '@prisma/client';
import { Series, BaseSeries, QuerySeries } from '../types/series.js';

const prisma = new PrismaClient();

async function createSeries(data: BaseSeries) {
  const series = await prisma.series.create({
    data: data,
  });
  if (series) {
    return series;
  }
  throw new Error('failed to create series');
}

async function viewSeries(id: number) {
  const series = await prisma.series.findUnique({ where: { id: id } });
  if (series) {
    return series;
  }
  throw new Error('series not found');
}

async function updateSeries(id: number, data: BaseSeries) {
  const series = await prisma.series.update({
    where: { id: id },
    data: {
      name: data.name,
      url: data.url,
    },
  });
  if (series) {
    return series;
  }
  throw new Error('series not found');
}

async function searchSeries(params: QuerySeries) {
  const { name, url, page = 1, perPage = 10 } = params;
  let { sort = 'id' } = params;
  let sortWay = 'asc';
  if (sort[0] === '-') {
    sort = sort.substring(1);
    sortWay = 'desc';
  }
  const whereConditions = [];
  if (name) {
    whereConditions.push({
      name: {
        contains: name,
      },
    });
  }
  if (url) {
    whereConditions.push({
      url: {
        contains: url,
      },
    });
  }
  const whereQuery = whereConditions.length ? { OR: whereConditions } : {};
  const series = await prisma.series.findMany({
    where: whereQuery,
    skip: (page - 1) * perPage,
    take: Number(perPage),
    orderBy: {
      [sort]: sortWay,
    },
  });
  const total = await prisma.series.count({ where: whereQuery });
    return {
      items: series,
      _meta: {
        currentPage: Number(page),
        pageCount: Math.ceil(total / perPage),
        perPage: Number(perPage),
        totalCount: total,
      },
    };
}

async function removeSeries(id: number) {
  return await prisma.series.delete({ where: { id: id } });
}

export { createSeries, viewSeries, updateSeries, searchSeries, removeSeries };
