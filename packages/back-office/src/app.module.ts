import { TvShowUpdatesGateway } from './services/tv-show-updates.gateway';
import { DraftsController } from './controllers/drafts.controller';
import { FileUploadService } from './services/file-upload.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '@comingsoonseries/auth/auth.module';
import { CoreModule } from '@comingsoonseries/core/core.module';
import { TvShowsController } from './controllers/tv-shows.controller';
import { AuthController } from './controllers/auth.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [AuthController, TvShowsController, DraftsController],
  providers: [FileUploadService, TvShowUpdatesGateway],
})
export class AppModule {}
