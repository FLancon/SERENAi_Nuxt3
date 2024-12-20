import { Beds24Client } from "~/lib/beds24";
import { validateBookingAccess } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const client = new Beds24Client({ token: nuxtConfig.token });
    const bookingId = event.context.params.id;

    // Validate access
    await validateBookingAccess(event);

    const response = await client.bookings.get(bookingId);
    return response;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || "Failed to fetch booking",
    });
  }
});
