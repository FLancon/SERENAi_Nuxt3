import { Beds24Client } from '~/lib/beds24';
import { validateBookingAccess } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const body = await readBody(event);

    // Validate message IDs
    if (!Array.isArray(body.messageIds) || !body.messageIds.length) {
      throw createError({
        statusCode: 400,
        message: 'Invalid message IDs'
      });
    }

    // Validate access
    await validateBookingAccess(event);

    const response = await client.messages.markAsRead(body.messageIds);
    return response;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to mark messages as read'
    });
  }
});