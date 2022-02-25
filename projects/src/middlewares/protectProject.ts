import { ForbiddenOperationError, BadRequestError } from '@geekfindr/common'
import { Request, Response, NextFunction } from 'express'

import { User } from '../models/user'
import { Project, ProjectDoc } from '../models/project'

declare global {
  namespace Express {
    interface Request {
      project: ProjectDoc
    }
  }
}

export const protectProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userQuery = User.findById(req.user!.id)
  const projectQuery = Project.findById(req.params.projectId)
  const [user, project] = await Promise.all([userQuery, projectQuery])
  if (!project || project.isDeleted) {
    throw new BadRequestError('Project not found')
  }

  const isUserAMember = !!user?.projects.find(
    (_project) =>
      _project.project.toString() === req.params.projectId.toString()
  )
  if (!isUserAMember) {
    throw new ForbiddenOperationError()
  }

  req.project = project as ProjectDoc

  next()
}
