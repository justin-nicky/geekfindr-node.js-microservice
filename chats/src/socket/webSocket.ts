import { Server } from 'socket.io'

export class Websocket extends Server {
  private static io: Websocket

  constructor(httpServer: any) {
    super(httpServer, {
      path: '/api/v1/chats/socket.io',
      cors: {
        origin: '*',
        methods: 'GET',
      },
      allowEIO3: true,
    })
  }

  public static getInstance(httpServer?: any): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer)
    }

    return Websocket.io
  }
}
