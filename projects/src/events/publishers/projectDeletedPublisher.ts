import { Subjects, Publisher, ProjectDeletedEvent } from '@geekfindr/common'

export class ProjectDeletedPublisher extends Publisher<ProjectDeletedEvent> {
  readonly subject = Subjects.ProjectDeleted
}
