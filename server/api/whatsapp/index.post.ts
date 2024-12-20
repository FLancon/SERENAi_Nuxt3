import axios from "axios";

export default defineEventHandler(async (event) => {
  try {
    const nuxtConfig = useRuntimeConfig();
    const token = nuxtConfig.whatsappToken;

    // const body = await readBody(event);

    // console.log("body", body);

    const url = "https://graph.facebook.com/v21.0/444266882112668/messages";

    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "+33681601822",
      type: "text",
      text: {
        preview_url: false,
        body: "Salut toi",
      },
    });

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // return data;
  } catch (error) {
    console.error("Error creating message:", error);
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || "Failed to create message",
    });
  }
});
