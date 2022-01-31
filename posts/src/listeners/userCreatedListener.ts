import { Message } from 'node-nats-streaming'
import { UserCreatedEvent, Subjects, Listener } from '@geekfindr/common'

import { User } from '../models/user'

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated
  queueGroupName = 'post-service'

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('User created event recieved', data)
    const { id, username, avatar } = data
    const user = User.build({ id, username, avatar })
    await user.save()
    msg.ack()
  }
}
