import { Subjects, Publisher, ProjectJoinRequestEvent } from '@geekfindr/common'

export class ProjectJoinRequestPublisher extends Publisher<ProjectJoinRequestEvent> {
  readonly subject = Subjects.ProjectJoinRequest
}
