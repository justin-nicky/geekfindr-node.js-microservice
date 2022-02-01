import { Subjects, Publisher, UserCreatedEvent } from '@geekfindr/common'

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated
}
