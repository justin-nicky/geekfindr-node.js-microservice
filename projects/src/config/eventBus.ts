import { natsWrapper } from '../natsWrapper'
import { UserCreatedListener } from '../events/listeners/userCreatedListener'
import { ProjectCreatedListener } from '../events/listeners/projectCreatedListner'
import { ProjectJoinRequestListener } from '../events/listeners/projectJoinRequestListner'

export const connectEventBus = async () => {
  try {
    await natsWrapper.connect(
      'geekfindr',
      process.env.NATS_CLIENT_ID!,
      'http://nats-srv:4222'
    )

    new UserCreatedListener(natsWrapper.client).listen()
    new ProjectCreatedListener(natsWrapper.client).listen()
    new ProjectJoinRequestListener(natsWrapper.client).listen()
  } catch (error: any) {
    console.error(error.message)
  }
}
