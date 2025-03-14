import express from 'express';
import session from 'express-session';
import dbConnect from './database/connect.js';
import User from './models/user.js';
import passport from 'passport';
import flash from 'connect-flash';
import initializePassport from './middlewares/passport-config.js';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 
import leaderboardRoutes from './routes/leaderboard.js';
import participantRoutes from './routes/participant.js';
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io';
import Message from './models/message.js';

dotenv.config();

dbConnect();
let app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this frontend
    credentials: true, // Allow cookies and authentication headers
  })
);

// Authentication system
initializePassport(passport, process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
const users = new Map();
// Socket.io event handling
io.on("connection", (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);
  socket.on("registerUser", ({ userId }) => {
    if (userId) {
      users.set(userId, socket.id);
      console.log(`User ${userId} mapped to socket ${socket.id}`);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        console.log(`❌ User ${userId} disconnected`);
        users.delete(userId);
        break;
      }
    }
  });

  socket.on("joinGroup", async ({ groupId }) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
    const messages = await Message.find({ }).sort({ timestamp: 1 });
    socket.emit("loadMessages", messages);
  });

  socket.on("sendMessage", async (data) => {
    const { groupId, userId, username, message } = data;
    const newMessage = new Message({ groupId, userId, username, message });
    await newMessage.save();
    io.to(groupId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/participant', participantRoutes);

app.get('/', async (req, res) => {
  res.send("hello there ...");
});

app.post('/', async (req, res) => {
  res.send("hello there ...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
