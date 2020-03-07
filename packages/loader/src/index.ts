import { RepositoryManager } from '@comingsoonseries/core/repositories';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { TvShowLoaderService } from './service/tv-show-loader.service';
import { AppModule } from './app.module';

dotenv.config();

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loader = app.get(TvShowLoaderService);

  // init DB Connection
  RepositoryManager.getConnection().subscribe(
    conn => {
      loader.load();
    },
    err => {
      throw new Error(`there was an error trying to connect to the DB: ${err}`);
    },
  );
})();
