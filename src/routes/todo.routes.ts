import type { FastifyInstance } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { createTodoBodySchema, todoParamsSchema } from '../schemas/todo.schema.js';

type CreateTodoBody = FromSchema<typeof createTodoBodySchema>;
type TodoParams = FromSchema<typeof todoParamsSchema>;

interface Todo {
  id: string;
  title: string;
  price: number;
  email?: string;
  description?: string;
  completed: boolean;
}

// In-memory database for todos
// In a real application, you would use a proper database instead of an in-memory array.
// This is just for demonstration purposes. if want to delete the data, clean the array or restart the server.
const todosDB: Todo[] = [];

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateTodoBody }>(
    '/todos',
    { schema: { body: createTodoBodySchema } },
    async (request, reply) => {
      const { title, description, price, email } = request.body;
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        price,
        email,
        description,
        completed: false,
      };
      todosDB.push(newTodo);
      return reply.status(201).send({ message: 'Todo berhasil dibuat', data: newTodo });
    },
  );

  fastify.get<{ Params: TodoParams }>(
    '/todos/:id',
    { schema: { params: todoParamsSchema } },
    async (request, reply) => {
      const { id } = request.params;
      const todo = todosDB.find((t) => t.id === id);
      if (!todo) {
        return reply.status(404).send({ statusCode: 404, message: 'Todo tidak ditemukan' });
      }
      return { data: todo };
    },
  );
}
