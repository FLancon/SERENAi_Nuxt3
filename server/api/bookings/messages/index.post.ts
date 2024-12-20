import { Beds24Client } from '~/lib/beds24';
import { validateBookingAccess } from '~/server/utils/auth';
import { validateMessagePayload } from '~/server/utils/validation';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const body = await readBody(event);

    // // Validate request payload
    // validateMessagePayload(body);

    // Validate access to booking
    await validateBookingAccess(event);


    const response = await client.messages.send(body);
    return response;

  } catch (error) {
    console.error('Error creating message:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to create message'
    });
  }
});