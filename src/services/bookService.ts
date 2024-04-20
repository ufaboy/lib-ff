import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Book, BaseBook, QueryBooks, BookFromDB } from '../types/book.js';
import { BookTagShrink, Tag } from '../types/tag.js';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient({
  // log: ['query'],
});

async function createBook(data: BaseBook) {
  const book = await prisma.book.create({
    include: {
      author: true,
      series: true,
      media: true,
      book_tag: {
        select: {
          tag: true,
        },
      },
    },
    data: {
      name: data.name,
      description: data.description,
      source: data.source,
      cover: data.cover,
      rating: data.rating,
      text: data.text,
      text_length: data.text?.length,
      author_id: data.author_id,
      series_id: data.series_id,
      updated_at: new Date(),
      book_tag: {
        createMany: {
          data: data.tag_ids.map((item) => {
            return { tag_id: item };
          }),
        },
      },
    },
  });
  if (book) {
    return prepareBook(book);
  }
  throw new Error('failed to create book');
}

async function viewBook(id: number) {
  const book = await prisma.book.findUnique({
    where: { id: id },
    include: {
      author: true,
      series: true,
      media: true,
      book_tag: {
        select: {
          tag: true,
        },
      },
    },
  });
  if (book) {
    return prepareBook(book);
  }
  throw new Error('book not found');
}
async function readBook(id: number) {
  const book = await prisma.book.update({
    where: { id: id },
    include: {
      media: true,
    },
    data: {
      view_count: {
        increment: 1,
      },
      last_read: new Date(),
    },
  });
  if (book) {
    return book
    // const text = parseTextBook(book.text);
    // return { ...book, text: text };
  }
  throw new Error('book not found');
}

async function updateBook(bookID: number, data: BaseBook) {
  const book = await prisma.book.update({
    where: { id: bookID },
    include: {
      author: true,
      series: true,
      media: true,
      book_tag: {
        select: {
          tag: true,
        },
      },
    },
    data: {
      name: data.name,
      description: data.description,
      source: data.source,
      cover: data.cover,
      rating: data.rating,
      text: data.text,
      text_length: data.text?.length,
      author_id: data.author_id,
      series_id: data.series_id,
      updated_at: new Date(),
      book_tag: {
        deleteMany: {},
        createMany: {
          data: data.tag_ids.map((item) => {
            return { tag_id: item };
          }),
        },
      },
    },
  });

  if (book) {
    saveTextToFile(bookID, book.text);
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
        gte: new Date(updated_at),
        lte: new Date(),
      },
    });
  }
  if (last_read) {
    whereConditions.push({
      last_read: {
        gte: new Date(last_read),
        lte: new Date(),
      },
    });
  }
  const whereQuery = whereConditions.length ? { AND: whereConditions } : {};
  const books = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      source: true,
      rating: true,
      cover: true,
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
    orderBy: [
      {
        [sort]: sortWay,
      },
      {
        id: 'desc',
      },
    ],
    skip: (page - 1) * perPage,
    take: Number(perPage),
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

function convertTags(tags: BookTagShrink[] | null) {
  if (tags) {
    return tags.filter((item) => item.tag).map((bt) => bt.tag as Tag);
  }
  return [];
}

function prepareBook(book: BookFromDB): Book {
  const {
    id,
    name,
    description,
    source,
    rating,
    cover,
    series,
    author,
    text,
    media,
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
    series,
    author,
    text: text ?? null,
    media: media
      ? media.map((img) => {
          return {
            id: img.id,
            file_name: img.file_name,
            path: img.path,
            book: {
              id: id,
              name: name,
            },
          };
        })
      : [],
    text_length,
    view_count,
    updated_at: updated_at ?? new Date(),
    last_read,
    tags: convertTags(book.book_tag),
  };
}

function parseTextBook(text: string | null) {
  if (text) {
    const $ = cheerio.load(text);
    const sections: Array<string|null> = [];
    $('section').each(function () {
      sections.push($(this).prop('outerHTML'));
    });
    return sections;
  } else return null;
}

function saveTextToFile(bookID: number, text: string | null) {
  if (!text) {
    return null;
  }
  const fileName = `${String(bookID).padStart(3, '0')}.html`;
  const filePath = path.join('/app/storage/books', fileName);
  fs.writeFile(filePath, text, (err) => {
    return err ?? true;
  });
}

export {
  createBook,
  viewBook,
  readBook,
  updateBook,
  searchBook,
  removeBook,
  parseTextBook,
};
