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
import { TvShowShortInfo } from '../models/tv-show-short-info';

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
  getTvShowShortInfos(searchTerm: string): Observable<TvShowShortInfo[]> {
    return this.tvShowRepository.getTvShowsShortInfo(searchTerm);
  }

  getProducts(tvShowId: string): Observable<Product[]> {
    return this.tvShowRepository.getProducts(tvShowId);
  }

  create(tvShowDto: TvShowDTO): Observable<TvShow> {
    return this.tvShowRepository.add(
      this.tvShowRepository.getEntityFromDTO(tvShowDto),
    );
  }

  update(tvShowId: string, tvShow: TvShow): Observable<TvShow> {
    return this.tvShowRepository.update(tvShowId, tvShow);
  }
}
