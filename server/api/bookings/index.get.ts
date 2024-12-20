import { Beds24Client } from '~/lib/beds24';
import { validateBookingAccess } from '~/server/utils/auth';


export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const query = getQuery(event);

    // Validate access
    await validateBookingAccess(event);

    const filters = {
      propertyId: query.propertyId
        ? parseInt(query.propertyId as string)
        : undefined,
      status: query.status as 'confirmed' | 'pending' | 'cancelled',
      arrival: query.arrival ? new Date(query.arrival as string) : undefined,
      departure: query.departure ? new Date(query.departure as string) : undefined,
      bookingTime: query.bookingTime
        ? new Date(query.bookingTime as string)
        : undefined,
      page: query.page ? parseInt(query.page as string) : undefined,
      limit: query.limit ? parseInt(query.limit as string) : undefined,
    };

    const response = await client.bookings.list(filters);
    return response;
  } catch (error) {
    console.error('Error fetching1 bookings:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to fetch bookings',
    });
  }
});
