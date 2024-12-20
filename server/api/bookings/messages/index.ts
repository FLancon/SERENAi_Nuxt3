import { Beds24Client } from '~/lib/beds24';

export default defineEventHandler(async (event) => {
  const nuxtConfig = useRuntimeConfig();
  const method = event.node.req.method;

  // Ensure we have a token
  if (!nuxtConfig.token) {
    throw createError({
      statusCode: 500,
      message: 'API token not configured'
    });
  }

  try {
    const client = new Beds24Client({ 
      token: nuxtConfig.token
    });

    if (method === 'GET') {
      const query = getQuery(event);
      const response = await client.messages.list({
        bookingId: query.bookingId ? parseInt(query.bookingId as string) : undefined
      });
      return response;
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const response = await client.messages.send(body.bookingId, body.content);
      return response;
    }

    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error handling messages:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to handle messages request'
    });
  }
});