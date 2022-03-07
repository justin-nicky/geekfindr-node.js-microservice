import mongoose from 'mongoose'

const users: {
  id: mongoose.Types.ObjectId
  socketId: string
  room: mongoose.Types.ObjectId
}[] = []

// Join user to chat
export const userJoin = (
  id: mongoose.Types.ObjectId,
  socketId: string,
  room: mongoose.Types.ObjectId
) => {
  const user = { id, socketId, room }
  users.push(user)

  return user
}

// Get current user
export const getCurrentUser = (socketId: string) => {
  return users.find((user) => user.socketId === socketId)
}

// User leaves chat
export const userLeave = (socketId: string) => {
  const index = users.findIndex((user) => user.socketId === socketId)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// // Get room users
// function getRoomUsers(room) {
//   return users.filter(user => user.room === room);
// }
