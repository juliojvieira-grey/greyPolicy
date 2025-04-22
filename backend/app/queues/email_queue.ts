// app/queues/email_queue.ts
import { Queue } from 'bullmq'
import redisConfig from '#services/redis'

export interface EmailJobData {
  to: string
  subject: string
  html: string
}

export const emailQueue = new Queue<EmailJobData>('emails', {
  connection: redisConfig,
})
