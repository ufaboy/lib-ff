import { PrismaClient } from '@prisma/client';
import {
  Media,
  MediaFromDB,
  QueryMedia,
  StorageMedia,
} from '../types/media.js';
import { pipeline } from 'stream';
import util, { promisify } from 'node:util';
import fs from 'fs';
import path from 'path';
import fastifyMultipart from '@fastify/multipart';
import multipart from '@fastify/multipart';
import { RequestFormField } from '../types/meta.js';

const prisma = new PrismaClient();
const pump = util.promisify(pipeline);

async function uploadMedia(part: multipart.MultipartFile) {
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
  await prisma.media.create({
    data: {
      file_name: part.filename,
      path: dirPath,
      book_id: Number(bookID.value),
    },
  });
}

async function uploadMediaList(
  bookID: number,
  files?: AsyncIterableIterator<fastifyMultipart.MultipartFile>
) {
  if (!files) return null;
  const mediaList = [];

  const dirPath = `media/book_${String(bookID).padStart(3, '0')}`;
  const fullDirPAth = `storage/${dirPath}`;
  if (!fs.existsSync(fullDirPAth)) {
    fs.mkdirSync(fullDirPAth, { recursive: true });
  }
  console.log('uploadMedia', files);
  for await (const part of files) {
    try {
      const fileName = part.filename;
      await pump(part.file, fs.createWriteStream(`${fullDirPAth}/${fileName}`));
      const media = await prisma.media.create({
        data: {
          file_name: fileName,
          path: dirPath,
          book_id: bookID,
        },
      });
      mediaList.push(media);
    } catch (error) {
      console.error('Error in file upload:', error);
    }
  }
  return mediaList;
}

async function viewMedia(id: number) {
  const media = await prisma.media.findUnique({ where: { id: id } });
  if (media) {
    return media;
  }
  throw new Error('media not found');
}

async function viewMediaByName(bookID: number, mediaName: string) {
  const media = await prisma.media.findFirst({
    where: { book_id: bookID, file_name: mediaName },
  });
  if (media) {
    return media;
  }
  throw new Error('media not found');
}

async function updateMedia(data: Media) {
  const media = await prisma.media.update({
    where: { id: data.id },
    data: {
      file_name: data.file_name,
    },
  });
  if (media) {
    return media;
  }
  throw new Error('media not found');
}

async function searchMedia(params: QueryMedia) {
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
  const mediaList = await prisma.media.findMany({
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
  const total = await prisma.media.count({ where: whereQuery });
  return {
    items: prepageMedia(mediaList),
    _meta: {
      currentPage: Number(page),
      pageCount: Math.ceil(total / (perPage ?? 1)),
      perPage: Number(perPage),
      totalCount: total,
    },
  };
}

async function totalMediaBooks() {

  // return result.map((item) => ({
  //   book_id: item.book_id,
  //   images_count: item._count.book_id,
  // }));
  const storageMedia = await getAllStorageMedia();
  const books = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: { in: storageMedia.map((item) => item.bookID) },
    },
  });
  const result = storageMedia.map(item => {
    const book = books.find(elem => elem.id === item.bookID)
    return {bookID: item.bookID, bookName: book?.name, mediaList: item.media}
  })

  return result;
}

async function removeMedia(id: number) {
  const result = await prisma.media.delete({ where: { id: id } });
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

async function removeMediaAll(bookID: number) {
  await prisma.media.deleteMany({ where: { book_id: bookID } });
  const dirPath = `storage/media/book_${String(bookID).padStart(3, '0')}`;
  fs.rm(dirPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log('removeMediaAll', dirPath);
    return true;
  });
}

function prepageMedia(mediaList: Array<MediaFromDB>) {
  return mediaList.map((img) => {
    return {
      id: img.id,
      file_name: img.file_name,
      path: img.path,
      book: img.book,
    };
  });
}

async function getAllStorageMedia() {
  const readdir = promisify(fs.readdir);
  const stat = promisify(fs.stat);
  const storagePath = 'storage/media';
  const folders = await readdir(storagePath);
  const bookMedia: StorageMedia[] = [];

  for (const folder of folders) {
    const folderPath = path.join(storagePath, folder);
    const folderStat = await stat(folderPath);

    if (folderStat.isDirectory()) {
      const match = folder.match(/^book_(\d+)$/);
      if (match) {
        const bookID = parseInt(match[1]);
        const media = await readdir(folderPath);
        bookMedia.push({ bookID, media });
      }
    }
  }

  return bookMedia;
}

export {
  uploadMedia,
  uploadMediaList,
  viewMedia,
  viewMediaByName,
  updateMedia,
  searchMedia,
  removeMedia,
  removeMediaAll,
  prepageMedia,
  totalMediaBooks,
};
