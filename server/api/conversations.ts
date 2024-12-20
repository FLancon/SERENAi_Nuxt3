import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const filePath = resolve('server/data/conversations.json');
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading conversations:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to load conversations',
    });
  }
});