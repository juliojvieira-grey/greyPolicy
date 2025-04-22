// bullboard.ts
import express from 'express'
import { Queue } from 'bullmq'
import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import dotenv from 'dotenv'

dotenv.config()

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)

// Recria a fila com os mesmos parâmetros do backend
const emailQueue = new Queue('emails', {
  connection: {
    host: redisHost,
    port: redisPort,
  },
})

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
})

const app = express()
app.use('/admin/queues', serverAdapter.getRouter())

app.listen(3001, () => {
  console.log('✅ Bull Board está rodando em http://localhost:3001/admin/queues')
})
