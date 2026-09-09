import Fastify from 'fastify';
import ajvErrors from 'ajv-errors';

type ValidationError = {
  instancePath: string;
  params: Record<string, unknown>;
  message?: string;
};
type ValidationFastifyError = Error & { validation?: ValidationError[] };

export const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: 'all',
    },
    plugins: [ajvErrors as unknown as never],
  },
});

fastify.setErrorHandler<ValidationFastifyError>((error, _request, reply) => {
  if (error.validation) {
    // old config
    // const customErrors = error.validation.map((err) => ({
    //   field: err.instancePath.replace('/', '') || (err.params as { missingProperty?: string }).missingProperty || 'body',
    //   message: err.message,
    // }));
    const customErrors = error.validation.map((err) => err.message).filter((m): m is string => Boolean(m));
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validasi input gagal',
      errors: customErrors,
    });
  }
  reply.send(error);
});
