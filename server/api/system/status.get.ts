import { Beds24Client } from '~/lib/beds24';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    
    const response = await client.system.getStatus();
    return response;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch system status'
    });
  }
});