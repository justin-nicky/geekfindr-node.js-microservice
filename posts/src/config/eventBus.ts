import { natsWrapper } from '../natsWrapper'
import { UserCreatedListener } from '../events/listeners/userCreatedListener'
import { ProfileFollowingAddedListner } from '../events/listeners/profileFollowingAddedListner'

export const connectEventBus = async () => {
  try {
    await natsWrapper.connect(
      'geekfindr',
      process.env.NATS_CLIENT_ID!,
      'http://nats-srv:4222'
    )
    new UserCreatedListener(natsWrapper.client).listen()
    new ProfileFollowingAddedListner(natsWrapper.client).listen()
  } catch (error: any) {
    console.error(error.message)
  }
}
