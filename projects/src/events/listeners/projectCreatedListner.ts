import { Message } from 'node-nats-streaming'
import { ProjectCreatedEvent, Subjects, Listener } from '@geekfindr/common'
import mongoose from 'mongoose'

import { Project } from '../../models/project'
import { User } from '../../models/user'
import { MemberTypes } from '../../models/memberTypes'

export class ProjectCreatedListener extends Listener<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated
  queueGroupName = 'project-service'

  async onMessage(data: ProjectCreatedEvent['data'], msg: Message) {
    console.log('Project created event recieved', data)

    const { id, name, owner } = data as unknown as {
      id: mongoose.Types.ObjectId
      name: string
      owner: mongoose.Types.ObjectId
    }

    const project = Project.build({
      id,
      name,
      owner,
      team: [{ user: owner, role: MemberTypes.Owner }],
    })
    await project.save()

    const user = await User.findById(owner)
    user?.projects.push({ project: id, role: MemberTypes.Owner })
    await user?.save()

    msg.ack()
  }
}
