import { H3Event } from "h3";
import { validateWebhookSignature } from "~/server/utils/webhook";
import { WebhookStore } from "~/server/utils/webhookStore";
import { useAI } from "~/composables/useAI";
import { useMessages } from "~/composables/useMessages";

export default defineEventHandler(async (event: H3Event) => {
  
  const { incomingChat } = useAI();

  const { sendAIMessage } = useMessages();
  try {
    const body = await readBody(event);

    console.log("body.type: ", body.type);

    // Store webhook data
    const store = WebhookStore.getInstance();
    const webhook = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      eventType: body.type || "unknown",
      payload: body,
      status: "success",
    };

    store.addWebhook(webhook);

    const lastMessage = body.messages[body.messages.length - 1];
    console.log("lastMessage: ", lastMessage);
    console.log("lastMessage.read", lastMessage.read);
    console.log("MessageId lastMessage: ", lastMessage.id);

    //restreint à mes reservations
    if (
      (body.booking.id === 63311557 || 63526793) &&
      lastMessage.read === false
    ) {
      const AiResponse = await incomingChat(body);

      // send AIResponse to client.

      const data = await sendAIMessage(body.booking.id, AiResponse);

      // if (data.success) {
      //   console.log('MessageId lastMessage: ', lastMessage.id)
      // }
    }

    // Mark message as read.

    return {
      success: true,
      statusCode: 200,
      message: "Webhook received and processed successfully",
    };
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Store failed webhook if possible
    if (error.webhook) {
      const store = WebhookStore.getInstance();
      store.addWebhook({
        ...error.webhook,
        status: "failed",
        error: error.message,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error processing webhook",
    });
  }
});
