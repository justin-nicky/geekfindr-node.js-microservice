// async (data) => {
//     try {
//       const { userId, conversationId } = data
//       // todo: fetch user from db, check permissions
//       const user = userJoin(userId, socket.id, conversationId)
//       await socket.join(String(user.room))
//     } catch (error) {
//       console.error(error)
//     }
//   }
