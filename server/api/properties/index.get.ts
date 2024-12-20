import { Beds24Client } from '~/lib/beds24';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const query = getQuery(event);

    const filters = {
      active: query.active === 'true',
      channelId: query.channelId
        ? parseInt(query.channelId as string)
        : undefined,
      modifiedSince: query.modifiedSince
        ? new Date(query.modifiedSince as string)
        : undefined,
    };

    const response = await client.properties.list(filters);
    return response;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch properties',
    });
  }
});
