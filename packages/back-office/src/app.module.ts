import { Module } from '@nestjs/common';
import { AuthModule } from '@comingsoonseries/auth/auth.module';
import { CoreModule } from '@comingsoonseries/core/core.module';
import { TvShowsController } from './controllers/tv-shows.controller';
import { AuthController } from './controllers/auth-controller';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [AuthController, TvShowsController],
})
export class AppModule {}
