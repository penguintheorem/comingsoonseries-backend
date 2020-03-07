import { TvShow } from '@comingsoonseries/core/entities';
import { TvShowsService } from '@comingsoonseries/core/services';
import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TvShowShortInfo } from './../../../core/dist/models/tv-show-short-info.d';

@Controller('bo/tv-shows')
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

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
}
