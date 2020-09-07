import { DraftsRepository } from './repositories/drafts.repository';
import { DraftsService } from './services/drafts.service';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TvShowsService } from './services';
import { MongoRepositoryManager, TvShowRepository } from './repositories';

@Module({
  providers: [
    MongoRepositoryManager,
    TvShowRepository,
    TvShowsService,
    DraftsService,
    DraftsRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [
    MongoRepositoryManager,
    TvShowRepository,
    TvShowsService,
    DraftsService,
  ],
})
export class CoreModule {}
