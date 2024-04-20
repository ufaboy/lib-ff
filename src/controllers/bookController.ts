import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createBook,
  viewBook,
  readBook,
  updateBook,
  searchBook,
  removeBook,
} from '../services/bookService.js';
import {
  BookCreateRequest,
  BookUpdateForm,
  BookUpdateRequest,
  QueryBooks,
} from '../types/book.js';
import { uploadMediaList } from '../services/mediaService.js';
import { RequestQueryID } from '../types/meta.js';

async function search(
  req: FastifyRequest<{ Querystring: QueryBooks }>,
  reply: FastifyReply
) {
  try {
    const params = req.query;
    const books = await searchBook(params);
    reply.send(books);
  } catch (error) {
    reply.code(404).send(error);
  }
}

async function view(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const book = await viewBook(Number(id));
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}
async function read(req: RequestQueryID, reply: FastifyReply) {
  try {
    const { id } = req.query;
    const book = await readBook(Number(id));
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}

async function create(req: BookCreateRequest, reply: FastifyReply) {
  try {
    const data = normalizeBookForm(req.body);
    // const formFiles = req.body['Upload[imageFiles][]'];
    const book = await createBook(data);
    // const files = typeof formFiles === 'object' && 'fieldname' in formFiles ? await imageIterator(formFiles) : formFiles
    // await uploadImages(book.id, files);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}

async function update(req: BookUpdateRequest, reply: FastifyReply) {
  try {
    console.log('update boook', req.files)
    const bookID = Number(req.query.id);
    // const formFiles = req.body['Upload[imageFiles][]'];
    const data = normalizeBookForm(req.body);
    const book = await updateBook(bookID, data);
    // const files = typeof formFiles === 'object' && 'fieldname' in formFiles ? await imageIterator(formFiles) : formFiles
    // const image = await uploadImages(bookID, files);
    reply.send({ ...book });
  } catch (error) {
    reply.code(404).send(error);
  }
}

async function remove(
  req: FastifyRequest<{ Querystring: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params as { id: number };
    const book = await removeBook(id);
    reply.send(book);
  } catch (error) {
    reply.code(404).send(error);
  }
}

function normalizeBookForm(reqBody: BookUpdateForm) {
  return {
    name: reqBody['Book[name]'].value,
    tag_ids: Array.isArray(reqBody['Book[tag_ids][]'])
      ? reqBody['Book[tag_ids][]'].map((item) => Number(item.value))
      : [Number(reqBody['Book[tag_ids][]'].value)],
    description: reqBody['Book[description]'].value,
    text: reqBody['Book[text]'].value,
    cover: reqBody['Book[cover]'].value,
    source: reqBody['Book[source]'].value,
    rating: Number(reqBody['Book[rating]'].value),
    author_id: reqBody['Book[author_id]'].value
      ? Number(reqBody['Book[author_id]'].value)
      : null,
    series_id: reqBody['Book[series_id]'].value
      ? Number(reqBody['Book[series_id]'].value)
      : null,
  };
}

async function* MediaIterator<T>(img: T) {
  yield img;
}

export { search, view, read, create, update, remove };
