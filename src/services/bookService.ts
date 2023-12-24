import { PrismaClient } from '@prisma/client';
import { Book, BookRaw, ExpandParams, QueryBooks } from '../types/book.js';

const prisma = new PrismaClient();

async function createBook(data: BookRaw) {
  const book = await prisma.book.create({
    data: data,
  });
  if (book) {
    return prepareBook(book);
  }
  throw new Error('failed to create book');
}

async function viewBook(id: number, params?: ExpandParams) {
  
  // const book = await prisma.book.findUnique({
  //   where: { id: id },
  //   include: params,
  // });
  const book = await prisma.book.update({
    where: { id: id },
    include: params,
    data: {
      view_count: {
        increment: 1,
      },
    },
  });
  if (book) {
    return prepareBook(book);
  }
  throw new Error('book not found');
}

async function updateBook(data: Book, params?: ExpandParams) {
  const book = await prisma.book.update({
    where: { id: data.id },
    include: params,
    data: {
      name: data.name,
      description: data.description,
      source: data.source,
      cover: data.cover,
      rating: data.rating,
      text: data.text,
      author_id: data.author?.id,
      series_id: data.series?.id,
      updated_at: Date.now() / 1000
    },
  });
  if (book) {
    return prepareBook(book);
  }
  throw new Error('book not found');
}

async function searchBook(params: QueryBooks) {
  const {
    id,
    name,
    text,
    tag,
    rating,
    view_count,
    authorName,
    seriesName,
    size,
    updated_at,
    last_read,
    page = 1,
    perPage = 10,
  } = params;
  let { sort = 'id' } = params;
  let sortWay = 'asc';
  if (sort[0] === '-') {
    sort = sort.substring(1);
    sortWay = 'desc';
  }
  const whereConditions = [];
  if (id) {
    whereConditions.push({
      id: {
        equals: Number(id),
      },
    });
  }
  if (name) {
    whereConditions.push({
      name: {
        contains: name,
      },
    });
  }
  if (text) {
    whereConditions.push({
      text: {
        contains: text,
      },
    });
  }
  if (tag) {
    whereConditions.push({
      book_tag: {
        some: {
          tag: {
            name: tag,
          },
        },
      },
    });
  }
  if (rating) {
    whereConditions.push({
      rating: {
        gte: Number(rating),
      },
    });
  }
  if (view_count) {
    whereConditions.push({
      view_count: {
        gte: Number(view_count),
      },
    });
  }
  if (authorName) {
    whereConditions.push({
      author: {
        name: authorName,
      },
    });
  }
  if (seriesName) {
    whereConditions.push({
      series: {
        name: seriesName,
      },
    });
  }
  if (size) {
    const startSize =
      size === 'S' ? 0 : size === 'M' ? 50000 : size === 'L' ? 300000 : 500000;
    const endSize =
      size === 'S'
        ? 49999
        : size === 'M'
        ? 299999
        : size === 'L'
        ? 499999
        : 999999999;
    whereConditions.push({
      text_length: {
        lt: endSize,
        gt: startSize,
      },
    });
  }
  if (updated_at) {
    whereConditions.push({
      updated_at: {
        gte: new Date(updated_at).getTime() / 1000,
        lte: Date.now() / 1000,
      },
    });
  }
  if (last_read) {
    whereConditions.push({
      last_read: {
        gte: new Date(last_read).getTime() / 1000,
        lte: Date.now() / 1000,
      },
    });
  }
  const whereQuery = whereConditions.length ? { OR: whereConditions } : {};
  const books = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      source: true,
      rating: true,
      cover: true,
      bookmark: true,
      series: true,
      author: true,
      text_length: true,
      view_count: true,
      updated_at: true,
      last_read: true,
      book_tag: {
        select: {
          tag: true,
        },
      },
    },
    where: whereQuery,
    skip: (page - 1) * perPage,
    take: Number(perPage),
    orderBy: {
      [sort]: sortWay,
    },
  });
  const total = await prisma.book.count({ where: whereQuery });
  return {
    items: books.map(prepareBook),
    _meta: {
      currentPage: Number(page),
      pageCount: Math.ceil(total / perPage),
      perPage: Number(perPage),
      totalCount: total,
    },
  };
}

async function removeBook(id: number) {
  return await prisma.book.delete({ where: { id: id } });
}

function prepareBook(book: {
  book_tag?: any;
  id?: any;
  name?: any;
  description?: any;
  source?: any;
  rating?: any;
  cover?: any;
  bookmark?: any;
  series?: any;
  author?: any;
  text?: any;
  text_length?: any;
  view_count?: any;
  updated_at?: any;
  last_read?: any;
}) {
  const {
    id,
    name,
    description,
    source,
    rating,
    cover,
    bookmark,
    series,
    author,
    text,
    text_length,
    view_count,
    updated_at,
    last_read,
  } = book;
  return {
    id,
    name,
    description,
    source,
    rating,
    cover,
    bookmark,
    series,
    author,
    text,
    text_length,
    view_count,
    updated_at,
    last_read,
    tags: book.book_tag?.map((bt: { tag: any }) => bt.tag),
  };
}
export { createBook, viewBook, updateBook, searchBook, removeBook };
