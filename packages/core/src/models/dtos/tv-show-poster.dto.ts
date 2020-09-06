import { Network } from './../network';

export interface TvShowPoster {
  id: string;
  title: string;
  networks: Network[];
  poster: string;
}
