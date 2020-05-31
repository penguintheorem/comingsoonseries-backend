import { TvShowsService } from '@comingsoonseries/core/services';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TvShowPoster } from '@comingsoonseries/core/models';
import {
  PaginationParams,
  SponsoredTvShowsLists,
  Product,
  TvShowDTO,
} from '@comingsoonseries/core/models';
import { TvShowSuggestion } from '@comingsoonseries/core/models/dtos/tv-show-suggestion.dto';
import { TvShow } from '@comingsoonseries/core/entities';

// TODO: Manage all exceptions
@Controller('tv-shows')
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

  @Get('posters')
  // just for test the auth but free users access without problems to this
  // @UseGuards(AuthGuard('jwt'))
  getTvShowPosters(@Query() query): Observable<TvShowPoster[]> {
    // pagination
    const { page, size }: PaginationParams = query;
    // sorting
    const sort: number = query.sort && +query.sort;
    // filtering
    const { title, genres } = query;

    return this.tvShowsService.getTvShowPosters(
      { page: +page, size: +size },
      { title, genres: genres ? (genres as string).split(',') : undefined },
      { sort },
    );
  }

  @Get('sponsored')
  getSponsoredTvShows(@Query() query): Observable<SponsoredTvShowsLists> {
    // pagination
    const { page, size }: PaginationParams = query;

    return this.tvShowsService.getSponsoredTvShows({
      page: +page,
      size: +size,
    });
  }

  @Get('suggestions')
  getTvShowSuggestions(@Query() query): Observable<TvShowSuggestion[]> {
    const { q } = query;

    return this.tvShowsService.getSuggestions(q);
  }

  @Get(':tvShowId')
  getTvShow(
    @Param() urlSegmentParams: { tvShowId: string },
  ): Observable<TvShow> {
    return this.tvShowsService.find(urlSegmentParams.tvShowId);
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

    return this.tvShowsService.getProducts(
      urlSegmentParams.tvShowId,
      +limit,
      +offset,
    );
  }

  // back-office (small for now)
  @Post('')
  create(@Body() tvShowDto: TvShowDTO): Observable<TvShow> {
    return this.tvShowsService.create(tvShowDto);
  }

  @Put(':tvShowId')
  update(
    @Param() urlSegmentParams: { tvShowId: string },
    @Body() tvShow: TvShow,
  ): Observable<TvShow> {
    return this.tvShowsService.update(urlSegmentParams.tvShowId, tvShow);
  }
}
