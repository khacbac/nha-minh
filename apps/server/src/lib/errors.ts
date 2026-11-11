import { API_ERROR_CODES } from "@sonha/types";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Every error leaves as `{ status, code, message, details? }`. */
async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler<Error>((error, request, reply) => {
    if (error instanceof AppError) {
      if (error.statusCode >= 500)
        request.log.error({ err: error.details ?? error }, error.message);
      return reply.status(error.statusCode).send({
        status: error.statusCode,
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && error.statusCode < 500 && { details: error.details }),
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        status: 400,
        code: API_ERROR_CODES.validation,
        message: "Request validation failed",
        details: error.issues,
      });
    }

    const fastifyErr = error as Error & { statusCode?: number; code?: string };
    if (fastifyErr.statusCode && fastifyErr.statusCode < 500) {
      return reply.status(fastifyErr.statusCode).send({
        status: fastifyErr.statusCode,
        code: fastifyErr.code ?? "BAD_REQUEST",
        message: fastifyErr.message,
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      status: 500,
      code: API_ERROR_CODES.internal,
      message: "Internal server error",
    });
  });
}

export const errorHandlerPlugin = fp(errorHandler, { name: "error-handler" });
