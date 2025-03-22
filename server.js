require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());

app.delete("/api/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/${eventId}/`;

  try {
    await axios.delete(eventbriteUrl, {
      headers: {
        Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(
      "Error deleting Eventbrite event:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to delete event from Eventbrite",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Eventbrite Proxy Server is running");
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
