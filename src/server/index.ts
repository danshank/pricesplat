import Fastify from "fastify";
import 'dotenv/config' 
import dbConnector from './db'
import usersRoutes from "./routes/users";
import groupRoutes from "./routes/groups";

const fastify = Fastify({
    logger: true
})
fastify.register(dbConnector)
fastify.register(usersRoutes)
fastify.register(groupRoutes)


fastify.listen({ port: 3001 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
