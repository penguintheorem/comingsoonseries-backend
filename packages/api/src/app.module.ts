import { TvShowsController } from './controllers/tv-shows.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '@comingsoonseries/auth/auth.module';
import { CoreModule } from '@comingsoonseries/core/core.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [TvShowsController, AuthController],
})
export class AppModule {}
