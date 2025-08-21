async function usersRoutes (fastify) {
    fastify.get('/users', async (request, reply) => {
        fastify.pg.query(
            'SELECT display_name, email FROM users', 
            function onResult (err, result) {
            reply.send(err || result.rows)
            }
        )
        return reply
    });
}

export default usersRoutes;