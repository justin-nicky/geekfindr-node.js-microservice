import { Message } from 'node-nats-streaming'
import { ProjectDeletedEvent, Subjects, Listener } from '@geekfindr/common'

import { Post } from '../../models/post'

export class ProjectDeletedListener extends Listener<ProjectDeletedEvent> {
  readonly subject = Subjects.ProjectDeleted
  queueGroupName = 'post-service'

  async onMessage(data: ProjectDeletedEvent['data'], msg: Message) {
    console.log('Project-deleted event recieved', data)
    const { id } = data
    const post = await Post.findById(id)
    if (post) {
      post.isDeleted = true
      await post.save()
    }
    msg.ack()
  }
}
