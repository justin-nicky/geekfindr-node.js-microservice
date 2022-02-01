import { Message } from 'node-nats-streaming'
import { UserCreatedEvent, Subjects, Listener } from '@geekfindr/common'

import { Profile } from '../../models/profile'

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated
  queueGroupName = 'profile-service'

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('User created event recieved', data)
    const { id, email, username, avatar } = data
    const profile = Profile.build({ id, email, username, avatar })
    await profile.save()
    msg.ack()
  }
}
