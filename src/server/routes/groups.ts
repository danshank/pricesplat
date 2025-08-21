async function groupRoutes (fastify) {
    fastify.get('/groups/:id', async (request, reply) => {
        fastify.pg.query(
            'SELECT name FROM groups WHERE id=$1', [request.params.id], 
            function onResult (err, result) {
            reply.send(err || result.rows)
            }
        )
        return reply
    });
}

export default groupRoutes;