import { Worker } from 'bullmq'
import { ApplicationService } from '@adonisjs/core/types'
import MsGraphService from '#services/MsGraphService'
import type { EmailJobData } from '#queues/email_queue'
import redisConfig from '#services/redis'

export default class EmailWorkerProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const worker = new Worker<EmailJobData>(
      'emails',
      async (job) => {
        const graph = new MsGraphService()
        await graph.sendEmail(job.data.to, job.data.subject, job.data.html)
      },
      {
        connection: redisConfig
      }
    )

    worker.on('completed', (job) => {
      console.log(`✅ Email enviado para ${job.data.to}`)
    })

    worker.on('failed', (job, err) => {
      console.error(`❌ Falha ao enviar e-mail para ${job?.data.to}:`, err)
    })
  }
}
