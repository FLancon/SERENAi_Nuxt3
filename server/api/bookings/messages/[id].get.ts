import { Beds24Client } from '~/lib/beds24';
import { validateBookingAccess } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const bookingId = parseInt(event.context.params.id);

    // Validate booking ID
    if (isNaN(bookingId)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid booking ID'
      });
    }

    // Validate access to booking
    await validateBookingAccess(event);

    const response = await client.messages.getByBookingId(bookingId);
    return response;
  } catch (error) {
    console.error('Error fetching booking messages:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch booking messages'
    });
  }
});