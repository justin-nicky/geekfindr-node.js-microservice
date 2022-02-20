import { NotAuthorizedError } from '@geekfindr/common'
import { Request, Response, NextFunction } from 'express'
import { UserPayload } from '@geekfindr/common'

import { User, Project } from '../models/user'

export interface ProjectsPayload {
  projects: Project[]
}

declare global {
  namespace Express {
    interface Request {
      //user: UserPayload
      projects: ProjectsPayload
    }
  }
}

export const protectProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user!.id)

  const project = user?.projects.find(
    (_project) =>
      _project.project.toString() === req.params.projectId.toString()
  )
  if (!project) {
    throw new NotAuthorizedError()
  }
  req.projects = user?.projects as unknown as ProjectsPayload
  next()
}
