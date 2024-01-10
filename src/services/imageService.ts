import { PrismaClient } from '@prisma/client';
import { Image, ImageFromDB, QueryImages } from '../types/images.js';
import { pipeline } from 'stream';
import util from 'node:util';
import fs from 'fs';
import fastifyMultipart from '@fastify/multipart';
import multipart from '@fastify/multipart';
import { RequestFormField } from '../types/meta.js';

const prisma = new PrismaClient();
const pump = util.promisify(pipeline);

async function uploadImage(part: multipart.MultipartFile) {
  const bookID = part.fields.bookID as unknown as RequestFormField;
  const dirPath = `media/book_${String(bookID.value).padStart(3, '0')}`;
  const fullDirPAth = `storage/${dirPath}`;
  if (!fs.existsSync(fullDirPAth)) {
    fs.mkdirSync(fullDirPAth, { recursive: true });
  }
  await pump(
    part.file,
    fs.createWriteStream(`${fullDirPAth}/${part.filename}`)
  );
  await prisma.image.create({
    data: {
      file_name: part.filename,
      path: dirPath,
      book_id: Number(bookID.value),
    },
  });
}

async function uploadImages(
  bookID: number,
  files?: AsyncIterableIterator<fastifyMultipart.MultipartFile>
) {
  if (!files) return null;
  const images = [];

  const dirPath = `media/book_${String(bookID).padStart(3, '0')}`;
  const fullDirPAth = `storage/${dirPath}`;
  if (!fs.existsSync(fullDirPAth)) {
    fs.mkdirSync(fullDirPAth, { recursive: true });
  }
  console.log('uploadImages', files);
  for await (const part of files) {
    try {
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
    } catch (error) {
      console.error('Error in file upload:', error);
    }
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
  const { file_name, book_id, page, perPage } = params;
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
        equals: Number(book_id),
      },
    });
  }
  const whereQuery = whereConditions.length ? { OR: whereConditions } : {};
  const images = await prisma.image.findMany({
    where: whereQuery,
    include: {
      book: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip:
      page !== undefined && perPage !== undefined ? (page - 1) * perPage : 0,
    take: perPage ? Number(perPage) : undefined,
    orderBy: {
      [sort]: sortWay,
    },
  });
  const total = await prisma.image.count({ where: whereQuery });
  return {
    items: prepageImages(images),
    _meta: {
      currentPage: Number(page),
      pageCount: Math.ceil(total / (perPage ?? 1)),
      perPage: Number(perPage),
      totalCount: total,
    },
  };
}

async function totalImageBooks() {
  const result = await prisma.image.groupBy({
    by: ['book_id'],
    _count: {
      book_id: true,
    },
  });
  return result.map((item) => ({
    book_id: item.book_id,
    images_count: item._count.book_id,
  }));
}

async function removeImage(id: number) {
  const result = await prisma.image.delete({ where: { id: id } });
  if (result) {
    const dirPath = `media/book_${String(result.book_id).padStart(3, '0')}`;
    const fullDirPAth = `storage/${dirPath}`;
    const filePath = `${fullDirPAth}/${result.file_name}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      return true;
    });
  }
}

async function removeImagesAll(bookID: number) {
  await prisma.image.deleteMany({ where: { book_id: bookID } });
  const dirPath = `storage/media/book_${String(bookID).padStart(3, '0')}`;
  fs.rm(dirPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log('removeImagesAll', dirPath)
    return true;
  });
}

function prepageImages(images: Array<ImageFromDB>) {
  return images.map((img) => {
    return {
      id: img.id,
      file_name: img.file_name,
      path: img.path,
      book: img.book,
    };
  });
}

export {
  uploadImage,
  uploadImages,
  viewImage,
  updateImage,
  searchImage,
  removeImage,
  removeImagesAll,
  prepageImages,
  totalImageBooks,
};
