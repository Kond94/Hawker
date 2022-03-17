import client from "./client";

const send = (message, listingId) =>
  client.post("/messages", {
    data: {
      content: message,
      userFrom: 1,
      userTo: 5,
      dateTime: Date.now(),
    },
  });

export default {
  send,
};
