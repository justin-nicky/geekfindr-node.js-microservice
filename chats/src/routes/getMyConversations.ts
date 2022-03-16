import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { Conversation } from '../models/conversation'

const router = express.Router()

router.get(
  '/api/v1/chats/my-conversations',
  protectRoute,
  async (req: Request, res: Response) => {
    const conversations = await Conversation.find({
      participants: {
        $in: [req.user!.id],
      },
    }).populate([
      { path: 'participants', select: 'username avatar' },
      { path: 'messages', limit: 1 },
    ])
    //.select('-messages')

    res.send(conversations)
  }
)

export { router as getMyConversationsRouter }
