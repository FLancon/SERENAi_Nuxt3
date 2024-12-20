import { Beds24Client } from '~/lib/beds24';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const id = parseInt(event.context.params.id);

    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid property ID'
      });
    }

    const response = await client.properties.get(id);
    return response;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch property'
    });
  }
});