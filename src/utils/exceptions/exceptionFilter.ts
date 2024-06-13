import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';

interface IRpcException {
  statusCode: number;
  message: string;
}

@Catch(RpcException)
export class MicroServicesExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = ctx.getResponse<Response>();

    return throwError(() => this.microservicesExceptionHandler(error));
  }

  private microservicesExceptionHandler(error: IRpcException) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }
}
