import { TvShowPoster } from './dtos/tv-show-poster.dto';

export interface SponsoredTvShowsLists {
  trending: TvShowPoster[];
  latest: TvShowPoster[];
  mustToSee: TvShowPoster[];
}
