import { NextRequest, NextResponse } from "next/server";
import { InternalServerError } from "@/utils/errors";
import { CustomError } from "@/types/global.type";
import { logger } from "@/utils/logging";

export type Middleware<GParams = unknown> = (
  req: NextRequest,
  next: VoidFunction,
  otherProps?: GParams,
) => Promise<Response | void>;

const execMiddleware = async <GParams>(
  req: NextRequest,
  middlewares: Middleware<GParams>[],
  index = 0,
  otherProps?: GParams,
): Promise<Response | void> => {
  const current = middlewares[index];
  if (!current) return;

  return current(
    req,
    async () => {
      return execMiddleware(req, middlewares, index + 1, otherProps);
    },
    otherProps,
  );
};

const errorNameDefaultResponse = [
  "BadRequestError",
  "ValidationError",
  "UnauthorizedError",
  "ForbiddenError",
  "NotFoundError",
  "ConflictError",
  "InternalServerError",
  "TimeoutError",
];

export const handlerMiddleware =
  <GParams = unknown>(...middleware: Middleware<GParams>[]) =>
  async (req: NextRequest, otherProps?: GParams): Promise<Response> => {
    try {
      const result = await execMiddleware(req, middleware, 0, otherProps);

      if (!result) {
        return new Response("Not Found", { status: 404 });
      }

      return result;
    } catch (err) {
      const error = err as CustomError;

      if (errorNameDefaultResponse.includes(error?.name))
        return NextResponse.json(error, { status: error.statusCode });

      const internalServerError = new InternalServerError(
        "Erro interno do servidor.",
      );

      logger.error(
        { error, step: "Error in handlerMiddleware chain" },
        "Erro inesperado no handlerMiddleware",
      );
      return NextResponse.json(internalServerError, {
        status: internalServerError.statusCode,
      });
    }
  };
