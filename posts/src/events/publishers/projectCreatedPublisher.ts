import { Subjects, Publisher, ProjectCreatedEvent } from '@geekfindr/common'

export class ProjectCreatedPublisher extends Publisher<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated
}
