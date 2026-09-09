import { fastify } from './app.js';
import { todoRoutes } from './routes/todo.routes.js';

await fastify.register(todoRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

await start();
