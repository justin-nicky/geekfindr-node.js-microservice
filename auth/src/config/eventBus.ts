import { natsWrapper } from '../natsWrapper'

export const connectEventBus = async () => {
  try {
    await natsWrapper.connect(
      'geekfindr',
      process.env.NATS_CLIENT_ID!,
      'http://nats-srv:4222'
    )
  } catch (error: any) {
    console.error(error.message)
  }
}
