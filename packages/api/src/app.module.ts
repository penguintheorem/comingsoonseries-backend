import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TvShowsController } from './controllers/tv-shows.controller';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from '@comingsoonseries/auth/auth.module';
import { CoreModule } from '@comingsoonseries/core/core.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [TvShowsController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
