//Перехват входящего запроса есть ли тема
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TemaInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if(!request.headers.cookie){
      request.body.darkTema = false;
      return next.handle();
    }
    const cookies = request.headers.cookie;
    if(cookies){
      const parsedCookies = this.cookiesParer(cookies)
      if(Object.prototype.hasOwnProperty.call(parsedCookies, 'tema')){
          request.body.darkTema = true;
          return next.handle();
      }
      else{
        request.body.darkTema = false;
          return next.handle();
      }
    }
  }

  cookiesParer(cookies){
    return cookies?.split(';').reduce((prev, curr) => {
        const [name, value] = curr.trim().split('=');
        return { ...prev, [name]: value };
      }, {});
  }
}