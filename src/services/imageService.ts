import { PrismaClient } from '@prisma/client';
import { Image, QueryImages } from '../types/images.js';
import { pipeline } from 'stream';
import util from 'node:util';
import fs from 'fs';
import fastifyMultipart from '@fastify/multipart';

const prisma = new PrismaClient();

async function uploadImages(
  bookID: number,
  files?: AsyncIterableIterator<fastifyMultipart.MultipartFile>
) {
  if(!files) return null;
  const images = [];
  const pump = util.promisify(pipeline);
  const dirPath = `media/book_${String(bookID).padStart(3, '0')}`;
  const fullDirPAth = `storage/${dirPath}`
  if (!fs.existsSync(fullDirPAth)) {
    fs.mkdirSync(fullDirPAth, { recursive: true });
  }

  for await (const part of files) {
    const fileName = part.filename;
    await pump(part.file, fs.createWriteStream(`${fullDirPAth}/${fileName}`));

    const image = await prisma.image.create({
      data: {
        file_name: fileName,
        path: dirPath,
        book_id: bookID,
      },
    });
    images.push(image);
  }
  return images;
}

async function viewImage(id: number) {
  const image = await prisma.image.findUnique({ where: { id: id } });
  if (image) {
    return image;
  }
  throw new Error('image not found');
}

async function updateImage(data: Image) {
  const image = await prisma.image.update({
    where: { id: data.id },
    data: {
      file_name: data.file_name,
    },
  });
  if (image) {
    return image;
  }
  throw new Error('image not found');
}

async function searchImage(params: QueryImages) {
  const { file_name, book_id, page = 1, perPage = 10 } = params;
  let { sort = 'id' } = params;
  let sortWay = 'asc';
  if (sort[0] === '-') {
    sort = sort.substring(1);
    sortWay = 'desc';
  }
  const whereConditions = [];
  if (file_name) {
    whereConditions.push({
      file_name: {
        contains: file_name,
      },
    });
  }
  if (book_id) {
    whereConditions.push({
      book_id: {
        equals: book_id,
      },
    });
  }
  const whereQuery = whereConditions.length ? { OR: whereConditions } : {};
  const images = await prisma.image.findMany({
    where: whereQuery,
    skip: (page - 1) * perPage,
    take: Number(perPage),
    orderBy: {
      [sort]: sortWay,
    },
  });
  const total = await prisma.image.count({ where: whereQuery });
  return {
    items: images,
    _meta: {
      currentPage: Number(page),
      pageCount: Math.ceil(total / perPage),
      perPage: Number(perPage),
      totalCount: total,
    },
  };
}

async function removeImage(id: number) {
  return await prisma.image.delete({ where: { id: id } });
}

export { uploadImages, viewImage, updateImage, searchImage, removeImage };
