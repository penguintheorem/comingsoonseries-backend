import { Module } from '@nestjs/common';
import { TvShowsService } from './services';
import { MongoRepositoryManager, TvShowRepository } from './repositories';

@Module({
  providers: [MongoRepositoryManager, TvShowRepository, TvShowsService],
  exports: [MongoRepositoryManager, TvShowRepository, TvShowsService],
})
export class CoreModule {}
