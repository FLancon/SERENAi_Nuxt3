import { Beds24Client } from '~/lib/beds24';


export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const query = getQuery(event);

    if (!query.propertyId || !query.startDate || !query.endDate) {
      throw createError({
        statusCode: 400,
        message: 'Missing required parameters: propertyId, startDate, endDate',
      });
    }

    const response = await client.availability.getAvailability(
      parseInt(query.propertyId as string),
      new Date(query.startDate as string),
      new Date(query.endDate as string)
    );
    return response;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch availability',
    });
  }
});
