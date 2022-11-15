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

export const getCurrentUser = (id: string) => {
  return users.find((user) => user.id == id);
};
