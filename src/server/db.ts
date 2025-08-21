import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

async function dbConnector(fastify, options) {
    fastify.register(fastifyPostgres, {
        connectionString: process.env.DB_STRING
    })
}

export default fastifyPlugin(dbConnector)