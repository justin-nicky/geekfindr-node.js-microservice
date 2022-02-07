import { Message } from 'node-nats-streaming'
import {
  ProfileFollowingAddedEvent,
  Subjects,
  Listener,
} from '@geekfindr/common'

import { User } from '../../models/user'

export class ProfileFollowingAddedListner extends Listener<ProfileFollowingAddedEvent> {
  readonly subject = Subjects.ProfileFollowingAdded
  queueGroupName = 'post-service'

  async onMessage(data: ProfileFollowingAddedEvent['data'], msg: Message) {
    console.log('Profile following added event recieved', data)
    const { followeeId, followerId } = data
    const follower = await User.findById(followerId)
    const followee = await User.findById(followeeId)
    if (follower?.following !== undefined) {
      follower.following.push(followeeId)
    }
    if (followee?.followers !== undefined) {
      followee.followers.push(followerId)
    }
    await Promise.all([follower?.save(), followee?.save()])
    msg.ack()
  }
}
