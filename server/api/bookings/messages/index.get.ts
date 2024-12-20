import { Beds24Client } from "~/lib/beds24";
import { validateBookingAccess } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    console.log("client", client);
    const query = getQuery(event);

    // Validate access
    await validateBookingAccess(event);

    const filters = {
      bookingId: query.bookingId
        ? parseInt(query.bookingId as string)
        : undefined,
      dateFrom: query.dateFrom ? new Date(query.dateFrom as string) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo as string) : undefined,
      unreadOnly: query.unreadOnly === "true",
      page: query.page ? parseInt(query.page as string) : undefined,
      limit: query.limit ? parseInt(query.limit as string) : undefined,
    };

    const response = await client.messages.list(filters);
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || "Failed to fetch messages",
    });
  }
});
