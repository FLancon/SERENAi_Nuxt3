import axios from "axios";

export default defineEventHandler(async (event) => {
  const nuxtConfig = useRuntimeConfig();

  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.beds24.com/v2/bookings/messages",
      headers: {
        token: nuxtConfig.token,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages from Beds24:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch messages from Beds24",
    });
  }
});
