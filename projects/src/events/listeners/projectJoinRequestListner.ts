import { Message } from 'node-nats-streaming'
import { ProjectJoinRequestEvent, Subjects, Listener } from '@geekfindr/common'
import mongoose from 'mongoose'

import { Project } from '../../models/project'
import { MemberTypes } from '../../models/memberTypes'

export class ProjectJoinRequestListener extends Listener<ProjectJoinRequestEvent> {
  readonly subject = Subjects.ProjectJoinRequest
  queueGroupName = 'project-service'

  async onMessage(data: ProjectJoinRequestEvent['data'], msg: Message) {
    console.log('Project join-request event recieved', data)
    const { projectId, userId } = data as unknown as {
      projectId: mongoose.Types.ObjectId
      userId: mongoose.Types.ObjectId
    }
    const update = {
      $push: {
        team: {
          user: userId,
          role: MemberTypes.JoinRequest,
        },
      },
    }
    await Project.updateOne({ _id: projectId }, update)
    msg.ack()
  }
}
