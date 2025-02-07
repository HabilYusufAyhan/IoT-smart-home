const dotenv = require("dotenv").config();
const express = require("express");

const { Server } = require("socket.io");
const cors = require("cors");
// Express uygulaması ve HTTP sunucusu
const app = express();

// Veritabanı bağlantısı
require("./src/config/database");

// Router'lar
const authRouter = require("./src/routers/auth_router");
app.use(cors());
// Middleware'ler
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

// Router'ları kullan
app.use("/", authRouter);

// Socket.IO sunucusu

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: "*", // Gerekirse buraya frontend URL'nizi ekleyin
    methods: ["GET", "POST"],
  },
});

// Socket.IO bağlantı yönetimi
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // İstemci bağlantıyı kapattığında
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
// Hata yönetimi
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = { io };

// Socket.IO'yu dışa aktar
