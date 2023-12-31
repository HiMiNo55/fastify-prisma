import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import jwt from '@fastify/jwt'
import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'

export const server = Fastify()

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

server.register(jwt, { secret: "supersecret" })

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify()
    } catch (e) {
        return reply.send(e)
    }
})

server.get('/healthcheck', async function () {
    return { status: "OK" }
})

async function main() {

    for (const schema of userSchemas) {
        server.addSchema(schema)
    }

    server.register(userRoutes, { prefix: '/api/users' })

    try {
        await server.listen(3000, "0.0.0.0")
        console.log(`Server ready at http://0.0.0.0:3000`
        )
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main()