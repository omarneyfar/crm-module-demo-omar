import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';

/**
 * Catches Prisma's known request errors and translates them into meaningful
 * HTTP responses instead of leaking a generic 500. Any non-Prisma exception
 * is left untouched and handled by Nest's default exception filter.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[] | undefined)?.join(
          ', ',
        );
        message = target
          ? `A record with this ${target} already exists`
          : 'Unique constraint violation';
        break;
      }
      // Foreign key constraint failed (e.g. clientId points to a missing client)
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Related record does not exist';
        break;
      }
      // Operation depends on a record that was not found
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message =
          (exception.meta?.cause as string | undefined) ?? 'Record not found';
        break;
      }
      default: {
        this.logger.error(
          `Unhandled Prisma error ${exception.code}: ${exception.message}`,
        );
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
