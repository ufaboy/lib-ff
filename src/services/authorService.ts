import { PrismaClient } from '@prisma/client';
import { Author, QueryAuthor } from '../types/author.js';

const prisma = new PrismaClient();

async function createAuthor(data: Author) {
  const author = await prisma.author.create({
    data: data,
  });
  if (author) {
    return author;
  }
  throw new Error('failed to create author');
}

async function viewAuthor(id: number) {
  const author = await prisma.author.findUnique({ where: { id: id } });
  if (author) {
    return author;
  }
  throw new Error('author not found');
}

async function updateAuthor(data: Author) {
  const author = await prisma.author.update({
    where: { id: data.id },
    data: {
      name: data.name,
    },
  });
  if (author) {
    return author;
  }
  throw new Error('author not found');
}

async function searchAuthor(params: QueryAuthor) {
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
  const authors = await prisma.author.findMany({
    where: whereQuery,
    skip: (page - 1) * perPage,
    take: Number(perPage),
    orderBy: {
      [sort]: sortWay,
    },
  });
  const total = await prisma.author.count({ where: whereQuery });
  return {
    items: authors,
    _meta: {
      currentPage: Number(page),
      pageCount: Math.ceil(total / perPage),
      perPage: Number(perPage),
      totalCount: total,
    },
  };
}

async function removeAuthor(id: number) {
  return await prisma.author.delete({ where: { id: id } });
}

export { createAuthor, viewAuthor, updateAuthor, searchAuthor, removeAuthor };
