// DOM Elements
const chatForm = document.getElementById("chat-form");
const msg = document.getElementById("msg");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userLists = document.getElementById("users");

// from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Function
/**
 *
 * @function outputMessage
 * @param {object} message - The response from server
 * @param {string} message.username - The user who send message
 * @param {string} message.time - The time when message is send
 * @param {string} message.text - The message that sended
 * @returns {void}
 * */
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  chatMessage.appendChild(div);
};

/**
 * @function outputRoomName
 * @description add room name to DOM
 * @param {string} room
 * @returns {void}
 */
function outputRoomName(room) {
  roomName.innerText = room;
}

/**
 * @function outputUsers
 * @param {object[]}  users
 * @param {string}    users[].username
 * @returns {void}
 */
function outputUsers(users) {
  userLists.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}

// Socket
const socket = io("http://localhost:3000/");

socket.on("connect", () => {
  console.log("connected");
});

// Join chatroom
socket.emit("joinroom", {
  username,
  room,
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = msg.value;
  socket.emit("chatMessage", message);
  msg.value = "";
  msg.focus();
});

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  }
});
