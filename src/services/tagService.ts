import { PrismaClient } from '@prisma/client';
import { Tag, BaseTag } from '../types/tag.js';

const prisma = new PrismaClient();

async function createTag(name: string) {
  const tag = await prisma.tag.create({
    data: {
      name,
    },
  });
  if (tag) {
    return tag;
  }
  throw new Error('failed to create tag');
}
async function viewTag(id: number) {
  const tag = await prisma.tag.findUnique({ where: { id: id } });
  if (tag) {
    return tag;
  }
  throw new Error('tag not found');
}
async function updateTag(id: number, data: BaseTag ) {
  const tag = await prisma.tag.update({
    where: { id: id },
    data: {
      name: data.name,
      description: data.description
    },
  });
  if (tag) {
    return tag;
  }
  throw new Error('tag not found');
}
async function searchTag(params: { sort: string }) {
  let { sort = 'id' } = params;
  let sortWay = 'asc';
  if (sort[0] === '-') {
    sort = sort.substring(1);
    sortWay = 'desc';
  }
  const tags = await prisma.tag.findMany({
    orderBy: {
      [sort]: sortWay,
    },
  });
  return tags;
}
async function removeTag(id: number) {
  return await prisma.tag.delete({ where: { id: id } });
}

export { createTag, viewTag, updateTag, searchTag, removeTag };
