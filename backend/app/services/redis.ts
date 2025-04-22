// app/services/redis.ts
import { Redis } from 'ioredis'
import 'dotenv/config'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
})

export default redis
