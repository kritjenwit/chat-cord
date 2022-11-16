import express from "express";
import path from "path";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { formatMessage } from "./utils/messages";
import { getCurrentUser, getRoomUser, userJoin, userLeave } from "./utils/users";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

const botName = "ChatCord Bot";

app.use(express.json());
app.use(cors());

// Set Static server
app.use(express.static(path.join(__dirname, "/../public")));

// Run when client connects
io.on("connection", (socket) => {
  console.log("New Ws connection....");

  socket.on(
    "joinroom",
    ({ username, room }: { username: string; room: string }) => {
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

      socket.emit("message", formatMessage(botName, "Welcome to Chatcord"));

      // Boardcast when a wuser connected
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `A ${user.username} has joined the chat`)
        );

      // Send users and roominfo
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUser(user.room),
      })
    }
  );

  // runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user!.room).emit("message", formatMessage(botName, "A user has left the chat"));

      // Send users and roominfo
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUser(user.room),
      })
    }
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user!.room).emit("message", formatMessage(user!.username, msg));
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
