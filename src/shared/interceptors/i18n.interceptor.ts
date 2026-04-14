import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const lang = I18nContext.current()?.lang;
    this.cls.set('lang', lang);
    return next.handle();
  }
}
