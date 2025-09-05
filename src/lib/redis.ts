import { env } from "@/data/env/server"
import { Redis } from "@upstash/redis"

const redisClient = new Redis({
    url: env.REDIS_URL,
    token: env.REDIS_TOKEN,
})

// Add debugging wrapper
const originalExists = redisClient.exists.bind(redisClient)
redisClient.exists = async (...args: Parameters<typeof originalExists>) => {
    console.log("Redis exists called with:", args)
    const result = await originalExists(...args)
    console.log("Redis exists result:", result)
    return result
}

export { redisClient } 