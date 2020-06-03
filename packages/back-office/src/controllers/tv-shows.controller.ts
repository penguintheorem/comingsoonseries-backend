import { TvShow } from '@comingsoonseries/core/entities';
import { Product, TvShowShortInfo } from '@comingsoonseries/core/models';
import { TvShowsService } from '@comingsoonseries/core/services';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Delete,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, finalize, tap } from 'rxjs/operators';
import { File } from '../models/file';
import { ImageType } from './../models/image-type';
import { FileUploadService } from './../services/file-upload.service';
import { TvShowUpdatesGateway } from '../services/tv-show-updates.gateway';

@Controller('bo/tv-shows')
export class TvShowsController {
  constructor(
    private readonly tvShowUpdatesGateway: TvShowUpdatesGateway,
    private readonly tvShowsService: TvShowsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get('search')
  getTvShowSuggestions(@Query() query): Observable<TvShowShortInfo[]> {
    const { q } = query;

    return this.tvShowsService.getTvShowShortInfos(q);
  }

  /*+
   * @REVIEW
   * identical to the one used by the main api
   **/
  @Get(':tvShowId')
  getTvShow(@Param() urlSegmentParams: { tvShowId: string }): Observable<TvShow> {
    return this.tvShowsService.find(urlSegmentParams.tvShowId);
  }

  // MVP I
  @Put(':tvShowId')
  updateTvShow(
    @Param() urlSegmentParams: { tvShowId: string },
    @Body() tvShow: TvShow
  ): Observable<TvShow> {
    return this.tvShowsService
      .update(urlSegmentParams.tvShowId, tvShow)
      .pipe(tap(tvShow => this.tvShowUpdatesGateway.sendUpdates([tvShow])));
  }

  @Get(':tvShowId/products')
  getProducts(
    @Param() urlSegmentParams: { tvShowId: string },
    @Query() query
  ): Observable<{
    items: Product[];
    metadata: { count: number; size: number };
  }> {
    const { limit, offset } = query;

    return this.tvShowsService.getProducts(urlSegmentParams.tvShowId, +limit, +offset);
  }

  @Patch(':tvShowId/products')
  addProduct(
    @Param() urlSegmentParams: { tvShowId: string },
    @Body() product: Product
  ): Observable<Product> {
    return this.tvShowsService.addProduct(urlSegmentParams.tvShowId, product);
  }

  @Patch(':tvShowId/products/:productId')
  updateProduct(
    @Param() urlSegmentParams: { tvShowId: string; productId: string },
    @Body() product: Product
  ): Observable<Product> {
    return this.tvShowsService.updateProduct(
      urlSegmentParams.tvShowId,
      urlSegmentParams.productId,
      product
    );
  }

  @Delete(':tvShowId/products/:productId')
  deleteProduct(
    @Param() urlSegmentParams: { tvShowId: string; productId: string }
  ): Observable<boolean> {
    return this.tvShowsService.deleteProduct(urlSegmentParams.tvShowId, urlSegmentParams.productId);
  }

  @Post('products/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  uploadGadgetImage(@UploadedFile() file: File): Observable<{ fileUrl: string }> {
    const { originalname, path } = file;

    return this.fileUploadService
      .upload(originalname, path, ImageType.GADGET)
      .pipe(map(fileUrl => ({ fileUrl })));
  }

  // FileInterceptor extract file from the request using the @UploadedFile decorator
  // send body as Multipart Form
  @Post(':tvShowId/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: File,
    @Param() urlSegmentParams: { tvShowId: string },
    @Query() query
  ): Observable<any> {
    const type = query.type && +query.type;
    const { originalname, path } = file;

    if (type === undefined) {
      return throwError(new Error('type undefined'));
    }

    return this.fileUploadService
      .upload(originalname, path, type)
      .pipe(map(fileUrl => ({ fileUrl })));
  }
}
