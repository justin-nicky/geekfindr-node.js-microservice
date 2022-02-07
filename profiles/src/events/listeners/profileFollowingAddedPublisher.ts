import {
  Subjects,
  Publisher,
  ProfileFollowingAddedEvent,
} from '@geekfindr/common'

export class ProfileFollowingAddedPublisher extends Publisher<ProfileFollowingAddedEvent> {
  readonly subject = Subjects.ProfileFollowingAdded
}
