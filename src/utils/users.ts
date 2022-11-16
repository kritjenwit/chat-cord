const users: {
  id: string;
  username: string;
  room: string;
}[] = [];

// Join user to chat
export const userJoin = (id: string, username: string, room: string) => {
  const user = {
    id,
    username,
    room,
  };

  users.push(user);

  return user;
};

// User leave chat
export function userLeave(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return null;
}

// Get room users
export const getRoomUser = (room: string) => {
  return users.filter((user) => user.room === room);
};

export const getCurrentUser = (id: string) => {
  return users.find((user) => user.id == id);
};
