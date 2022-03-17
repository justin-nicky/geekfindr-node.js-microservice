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
      {
        path: 'messages',
        options: {
          //sort: { 'messages.createdAt': 'desc' },
          limit: 1,
        },
      },
    ])
    // const conversations = await Conversation.aggregate([
    //   {
    //     $match: {
    //       participants: {
    //         $in: [req.user!.id],
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'Message',
    //       let: { conversationId: '$_id' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               // $and: [
    //               //   {
    //               $eq: ['$conversationId', '$$conversationId'],
    //               //   },
    //               //   { $eq: ['$senderId', req.user!.id] },
    //               // ],
    //             },
    //           },
    //         },
    //         {
    //           $sort: { createdAt: -1 },
    //         },
    //         {
    //           $limit: 1,
    //         },
    //       ],
    //       as: 'lastMessage',
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       participants: 1,
    //       isRoom: 1,
    //       roomName: 1,
    //       lastMessage: {
    //         $arrayElemAt: ['$lastMessage', 0],
    //       },
    //     },
    //   },
    // ])

    res.send(conversations)
  }
)

export { router as getMyConversationsRouter }
