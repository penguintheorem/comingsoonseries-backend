import { Injectable } from '@nestjs/common';
import { Observable, forkJoin } from 'rxjs';
import { Product, TvShowDTO, SponsoredTvShowsLists } from '../models';
import { TvShowRepository } from '../repositories';
import { PaginationParams } from '../models/pagination-params';
import { Filters } from '../models/filters';
import { SortingParams } from '../models/sorting-params';
import { OrderingMode } from '../models/ordering-mode';
import { TvShowSuggestion } from '../models/dtos/tv-show-suggestion.dto';
import { TvShowPoster } from '../models/dtos/tv-show-poster.dto';
import { TvShow } from '../entities';

@Injectable()
export class TvShowsService {
  constructor(private readonly tvShowRepository: TvShowRepository) {}

  find(tvShowId: string): Observable<TvShow> {
    return this.tvShowRepository.find(tvShowId);
  }

  getTvShowPosters(
    paginationParams: PaginationParams,
    filters: Filters,
    sortingParams: SortingParams,
  ): Observable<TvShowPoster[]> {
    console.log({ paginationParams, filters, sortingParams });
    return this.tvShowRepository.getTvShowPosters(
      paginationParams,
      filters,
      sortingParams,
    );
  }

  getSponsoredTvShows(
    paginationParams: PaginationParams,
  ): Observable<SponsoredTvShowsLists> {
    return forkJoin({
      trending: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_POPULARITY,
        },
      ),
      latest: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_DATE,
        },
      ),
      mustToSee: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_RANK,
        },
      ),
    });
  }

  getSuggestions(searchTerm: string): Observable<TvShowSuggestion[]> {
    return this.tvShowRepository.getSuggestions(searchTerm);
  }

  getProducts(tvShowId: string): Observable<Product[]> {
    return this.tvShowRepository.getProducts(tvShowId);
  }

  create(tvShowDto: TvShowDTO): Observable<TvShow> {
    return this.tvShowRepository.add(this.getEntityFromDTO(tvShowDto));
  }

  update(tvShowId: string, tvShow: TvShow): Observable<TvShow> {
    return this.tvShowRepository.update(tvShowId, tvShow);
  }

  /**
   *
   * @param tvShows
   */
  toTvShowSuggestions(tvShows: TvShow[]): TvShowSuggestion[] {
    return tvShows.map(tvShow => {
      return {
        id: tvShow.id.toString(),
        title: tvShow.title,
        plot: tvShow.plot,
        release_year: tvShow.release_year,
        imdb_average_rank: tvShow.imdb_average_rank,
      };
    });
  }

  toTvShowGridItems(tvShows: TvShow[]): TvShowPoster[] {
    return tvShows.map(tvShow => {
      return {
        id: tvShow.id.toString(),
        title: tvShow.title,
        networks: tvShow.networks,
        poster: tvShow.poster,
      };
    });
  }

  getEntityFromDTO(tvShowDTO: TvShowDTO): TvShow {
    const tvShow: TvShow = new TvShow();

    tvShow.imdb_id = tvShowDTO.tconst;
    tvShow.title = tvShowDTO.primaryTitle;
    tvShow.release_year = tvShowDTO.startYear;
    tvShow.genres = tvShowDTO.genres;
    tvShow.isAdult = tvShowDTO.isAdult;
    tvShow.minutes = tvShowDTO.runtimeMinutes;
    tvShow.imdb_average_rank = tvShowDTO.imdb_average_rank;
    tvShow.imdb_num_votes = tvShowDTO.imdb_num_votes;
    tvShow.country = tvShowDTO.country;
    tvShow.next_release_date = null;
    tvShow.trailer = null;
    tvShow.plot = null;
    tvShow.poster = null;
    tvShow.cover = null;
    tvShow.directors = [];
    tvShow.networks = [];
    tvShow.products = [];
    tvShow.countLists = 0;

    return tvShow;
  }

  getEntitiesFromDTOs(tvShowDTOs: TvShowDTO[]): TvShow[] {
    return tvShowDTOs.map(this.getEntityFromDTO);
  }
}
