import { CoreModule } from '@comingsoonseries/core/core.module';
import { Module } from '@nestjs/common';
import { TvShowLoaderService } from './service/tv-show-loader.service';

@Module({
  imports: [CoreModule],
  providers: [TvShowLoaderService],
})
export class AppModule {}
