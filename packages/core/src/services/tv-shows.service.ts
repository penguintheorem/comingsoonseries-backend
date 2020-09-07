import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { forkJoin, Observable } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { TvShow } from '../entities';
import { Product, SponsoredTvShowsLists, TvShowDTO } from '../models';
import { TvShowPoster } from '../models/dtos/tv-show-poster.dto';
import { TvShowSuggestion } from '../models/dtos/tv-show-suggestion.dto';
import { Filters } from '../models/filters';
import { OrderingMode } from '../models/ordering-mode';
import { PaginationParams } from '../models/pagination-params';
import { SortingParams } from '../models/sorting-params';
import { TvShowShortInfo } from '../models/tv-show-short-info';
import { TvShowRepository } from '../repositories';
import { TvShowSearchResult } from '../models/tv-show-search-result';

@Injectable()
export class TvShowsService {
  constructor(private readonly tvShowRepository: TvShowRepository) {}

  // basically for the mvp
  search(query?: string, paginationParams?: PaginationParams): Observable<TvShowSearchResult[]> {
    return this.tvShowRepository.search(query, paginationParams);
  }

  find(tvShowId: string): Observable<TvShow> {
    return this.tvShowRepository.find(tvShowId);
  }

  getTvShowPosters(
    paginationParams: PaginationParams,
    filters: Filters,
    sortingParams: SortingParams
  ): Observable<TvShowPoster[]> {
    return this.tvShowRepository.getTvShowPosters(paginationParams, filters, sortingParams);
  }

  getSponsoredTvShows(paginationParams: PaginationParams): Observable<SponsoredTvShowsLists> {
    return forkJoin({
      trending: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_POPULARITY,
        }
      ),
      latest: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_DATE,
        }
      ),
      mustToSee: this.tvShowRepository.getTvShowPosters(
        paginationParams,
        {},
        {
          sort: OrderingMode.BY_RANK,
        }
      ),
    });
  }

  getSuggestions(searchTerm: string): Observable<TvShowSuggestion[]> {
    return this.tvShowRepository.getSuggestions(searchTerm);
  }
  getTvShowShortInfos(searchTerm: string): Observable<TvShowShortInfo[]> {
    return this.tvShowRepository.getTvShowsShortInfo(searchTerm);
  }

  getProducts(
    tvShowId: string,
    limit: number,
    offset: number
  ): Observable<{
    items: Product[];
    metadata: { count: number; size: number };
  }> {
    return this.tvShowRepository.getProducts(tvShowId, limit, offset);
  }

  create(tvShowDto: TvShowDTO): Observable<TvShow> {
    return this.tvShowRepository.add(this.tvShowRepository.getEntityFromDTO(tvShowDto));
  }

  addProduct(tvShowId: string, product: Product): Observable<Product> {
    return this.tvShowRepository.find(tvShowId).pipe(
      switchMap((tvShow: TvShow) => {
        tvShow.products.push({
          productId: ObjectId.createFromTime(new Date().getTime()),
          ...product,
        });
        return this.tvShowRepository.update(tvShowId, tvShow);
      }),
      mapTo(product)
    );
  }

  updateProduct(tvShowId: string, productId: string, newProduct: Product): Observable<Product> {
    return this.tvShowRepository.find(tvShowId).pipe(
      switchMap((tvShow: TvShow) => {
        tvShow.products = tvShow.products.map(product =>
          product.productId.toString() === productId ? newProduct : product
        );
        return this.tvShowRepository.update(tvShowId, tvShow);
      }),
      mapTo(newProduct)
    );
  }

  deleteProduct(tvShowId: string, productId: string): Observable<boolean> {
    return this.tvShowRepository.find(tvShowId).pipe(
      switchMap((tvShow: TvShow) => {
        tvShow.products = tvShow.products.filter(
          product => product.productId.toString() !== productId
        );
        return this.tvShowRepository.update(tvShowId, tvShow);
      }),
      mapTo(true)
    );
  }

  update(tvShowId: string, tvShow: TvShow): Observable<TvShow> {
    return this.tvShowRepository.update(tvShowId, tvShow);
  }
}
