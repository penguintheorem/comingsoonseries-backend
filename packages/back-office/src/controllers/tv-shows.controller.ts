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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { File } from '../models/file';
import { ImageType } from './../models/image-type';
import { FileUploadService } from './../services/file-upload.service';

@Controller('bo/tv-shows')
export class TvShowsController {
  constructor(
    private readonly tvShowsService: TvShowsService,
    private readonly fileUploadService: FileUploadService,
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
  getTvShow(
    @Param() urlSegmentParams: { tvShowId: string },
  ): Observable<TvShow> {
    return this.tvShowsService.find(urlSegmentParams.tvShowId);
  }

  @Patch(':tvShowId')
  updateTvShow(
    @Param() urlSegmentParams: { tvShowId: string },
    @Body() tvShow: TvShow,
  ): Observable<TvShow> {
    return this.tvShowsService.update(urlSegmentParams.tvShowId, tvShow);
  }

  @Get(':tvShowId/products')
  getProducts(
    @Param() urlSegmentParams: { tvShowId: string },
    @Query() query,
  ): Observable<{
    items: Product[];
    metadata: { count: number; size: number };
  }> {
    const { limit, offset } = query;

    console.log(`request for product received`);
    console.log(
      `tvShow: ${urlSegmentParams.tvShowId}, limit: ${limit}, offset: ${offset}`,
    );
    return this.tvShowsService.getProducts(
      urlSegmentParams.tvShowId,
      +limit,
      +offset,
    );
  }

  @Patch(':tvShowId/products')
  addProduct(
    @Param() urlSegmentParams: { tvShowId: string },
    @Body() product: Product,
  ): Observable<Product> {
    return this.tvShowsService.addProduct(urlSegmentParams.tvShowId, product);
  }

  @Patch(':tvShowId/products/:productId')
  updateProduct(
    @Param() urlSegmentParams: { tvShowId: string; productId: string },
    @Body() product: Product,
  ): Observable<Product> {
    return this.tvShowsService.updateProduct(
      urlSegmentParams.tvShowId,
      urlSegmentParams.productId,
      product,
    );
  }

  @Delete(':tvShowId/products/:productId')
  deleteProduct(
    @Param() urlSegmentParams: { tvShowId: string; productId: string },
  ): Observable<boolean> {
    return this.tvShowsService.deleteProduct(
      urlSegmentParams.tvShowId,
      urlSegmentParams.productId,
    );
  }

  @Post('products/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  uploadGadgetImage(
    @UploadedFile() file: File,
  ): Observable<{ fileUrl: string }> {
    console.log('got file: ', file);
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
    @Query() query,
  ): Observable<any> {
    const type = query.type && +query.type;
    const { tvShowId } = urlSegmentParams;
    const { originalname, path } = file;
    let fileUrl = null;

    if (type === undefined) {
      return throwError(new Error('type undefined'));
    }

    return this.fileUploadService.upload(originalname, path, type).pipe(
      switchMap(url => {
        fileUrl = url;
        return this.tvShowsService.find(tvShowId);
      }),
      switchMap(tvShow => {
        // define an enum inside the core part please
        if (type === ImageType.COVER) {
          // cover
          tvShow.cover = fileUrl;
        } else if (type === ImageType.POSTER) {
          // poster
          tvShow.poster = fileUrl;
        }

        return this.tvShowsService.update(tvShowId, tvShow);
      }),
      map(tvShow => ({ fileUrl })),
    );
  }
}
