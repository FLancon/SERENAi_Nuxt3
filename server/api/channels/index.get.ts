import { Beds24Client } from '~/lib/beds24';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });

    const response = await client.channels.list();
    return response;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch channels',
    });
  }
});
