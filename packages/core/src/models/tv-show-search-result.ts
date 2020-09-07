import { Network } from './network';
import { TvShowState } from './tvShowState';

export interface TvShowSearchResult {
  title: string;
  coverImageUrl: string;
  currentSeasonNumber: number;
  state: TvShowState;
  nextReleaseDate: Date;
  networks: Network[];
}
