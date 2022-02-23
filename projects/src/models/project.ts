import mongoose, { Schema } from 'mongoose'

import { MemberTypes } from './memberTypes'

interface Team {
  user: mongoose.Types.ObjectId
  role: MemberTypes
}

interface Task {
  title: string
  description: string
  users: mongoose.Types.ObjectId[]
  isComplete: boolean
}

interface Todo {
  title: string
  tasks: string[]
}

// An interface that describes the properties
// that are requried to create a new Project
interface ProjectAttrs {
  name: string
  owner: mongoose.Types.ObjectId
  team?: Team[]
  id?: mongoose.Types.ObjectId
}

// An interface that describes the properties
// that a Project Model has
interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc
}

// An interface that describes the properties
// that a Project Document has
export interface ProjectDoc extends mongoose.Document {
  description?: string
  name: string
  owner: mongoose.Types.ObjectId
  team?: Team[]
  todo?: Todo[]
  task?: Task[]
  isDeleted: boolean
}

const teamSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: MemberTypes,
  },
})

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tasks: {
    type: [String],
    default: [],
  },
})

const todosSchema = new mongoose.Schema({
  todo: {
    type: [todoSchema],
  },
})

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  users: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
    default: [],
  },
  isComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const projectSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: [teamSchema],
      default: [],
    },
    todo: {
      type: [todoSchema],
      default: [],
    },
    task: {
      type: [taskSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        ret.id = ret._id
        delete ret._id
        delete ret.isDeleted
      },
    },
    timestamps: true,
  }
)

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  const _id = attrs.id
  delete attrs.id
  return new Project({ ...attrs, _id })
}
const Project = mongoose.model<ProjectDoc, ProjectModel>(
  'Project',
  projectSchema
)

const Todos = mongoose.model('Todos', todosSchema)

export { Project, Todos }
