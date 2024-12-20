import { WebhookStore } from '~/server/utils/webhookStore';

export default defineEventHandler(async (event) => {
  try {
    const store = WebhookStore.getInstance();
    return {
      success: true,
      data: store.getWebhooks()
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch webhooks'
    });
  }
});