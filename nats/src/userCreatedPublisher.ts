import Publisher from './publisher'
import { userCreatedEvent } from './userCreatedEvent'
import { Subjects } from './subjects'

export class UserCreatedPublisher extends Publisher<userCreatedEvent> {
  readonly subject = Subjects.UserCreated
  queueGroupName = 'user-service'

  constructor(client: Stan) {
    super(client)
  }

  publish(data: userCreatedEvent['data']) {
    super.publish(data)
  }
}
