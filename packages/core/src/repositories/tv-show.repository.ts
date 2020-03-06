import * as sanitize from 'mongo-sanitize';
import { ObjectId } from 'mongodb';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { getConnection, UpdateResult } from 'typeorm';
import { TvShow } from '../entities/tv-show.entity';
import { TvShowSuggestion } from '../models/dtos/tv-show-suggestion.dto';
import {
  PaginationParams,
  Filters,
  SortingParams,
  OrderingMode,
  Product,
  TvShowDTO,
} from '../models';
import { TvShowPoster } from '../models/dtos/tv-show-poster.dto';
import { MongoRepositoryManager } from './mongo-repository-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TvShowRepository {
  constructor(private readonly _manager: MongoRepositoryManager) {}

  add(tvShow: TvShow): Observable<TvShow> {
    return this._manager.getRepository<TvShow>(TvShow).pipe(
      switchMap(repo => from(repo.save(tvShow))),
      map(() => tvShow),
    );
  }

  /**
   * Finds a `TvShow` by a `tvShowId`.
   *
   * @param tvShowId - The id to use for the research
   * @returns An Observable that emits the `tvShow` found by the input id or `undefined`
   */
  find(tvShowId: string): Observable<TvShow> {
    return this._manager.getRepository<TvShow>(TvShow).pipe(
      switchMap(repo =>
        from(repo.find({ where: { _id: new ObjectId(tvShowId) } })),
      ),
      map(tvShows => tvShows[0]),
    );
  }

  /**
   * Search for tv shows implementing a regex with the `searchTerm`
   * passed as parameter.
   *
   * The research is a kind of full-text search.
   *
   * @param searchTerm - Search term to use to implement the regex
   */
  getSuggestions(searchTerm: string): Observable<TvShowSuggestion[]> {
    return this._manager.getRepository<TvShow>(TvShow).pipe(
      switchMap(repo =>
        from(
          repo.find({
            where: { title: new RegExp(sanitize(searchTerm), 'i') },
            order: { imdb_average_rank: 'DESC' },
            take: 20,
          }),
        ),
      ),
      map((tvShows: TvShow[]) => this.toTvShowSuggestions(tvShows)),
    );
  }

  getTvShowPosters(
    paginationParams: PaginationParams,
    filters: Filters,
    sortingParams: SortingParams,
  ): Observable<TvShowPoster[]> {
    const { page, size } = paginationParams;
    const { sort } = sortingParams;
    const { title, genres, isAdult, ended } = filters;
    const ordering = 'DESC';

    return this._manager.getRepository<TvShow>(TvShow).pipe(
      tap(repo => console.log('connection established')),
      switchMap(repo =>
        from(
          repo.find({
            // pagination
            ...(paginationParams && { skip: page * size, take: size }),
            // @TASK: sorting by popularity, next season date ?
            // where: { },
            select: ['id', 'title', 'networks', 'poster'],
            // filtering
            where: {
              ...(title && { title: new RegExp(`.*${title}.*`, 'i') }),
              // is an array right ?
              ...(genres && { genres: { $in: genres } }),
              // TODO: please, take a decision on that
              // ...(isAdult && { isAdult }),
              // TODO: to implement this
              //...(ended && { ended: true }),
            },
            // sorting
            ...(sortingParams && {
              order: {
                ...(OrderingMode.BY_RANK === sort && {
                  imdb_average_rank: ordering,
                }),
                ...(OrderingMode.BY_DATE === sort && {
                  next_release_date: ordering,
                }),
                ...(OrderingMode.BY_POPULARITY === sort && {
                  countLists: ordering,
                }),
              },
            }),
          }),
        ),
      ),
      map((tvShows: TvShow[]) => this.toTvShowGridItems(tvShows)),
    );
  }

  /**
   * Get products associated with a `TvShow` with the given `tvShowId`.
   *
   * @param tvShowId - The id to use for the research
   * @returns An Observable that emits the products associated to the `tvShow` found by the input id or `undefined`
   */
  getProducts(tvShowId: string): Observable<Product[]> {
    return this.find(tvShowId).pipe(
      map(tvShow => (tvShow ? tvShow.products : undefined)),
    );
  }

  /**
   *
   * @param tvShowId
   * @param newTvShow
   */
  update(tvShowId: string, newTvShow: TvShow): Observable<TvShow> {
    return this._manager.getRepository<TvShow>(TvShow).pipe(
      switchMap(tvShowRepository =>
        tvShowRepository.update(tvShowId, newTvShow),
      ),
      map((updateResult: UpdateResult) => updateResult[0] as TvShow),
    );
  }

  // TODO: make params optional
  /**
   *
   * @param paginationParams
   * @param filters
   * @param sortingParams
   */
  // list(
  //   paginationParams: PaginationParams,
  //   filters: Filters,
  //   sortingParams: SortingParams
  // ): Observable<TvShow[]> {
  //   const { page, size } = paginationParams;
  //   const { ordering, latest, rank, popularity } = sortingParams;
  //   const { title, genres, isAdult, ended } = filters;

  //   return this._manager.getRepository<TvShow>(TvShow).pipe(
  //     switchMap((repo: Repository<TvShow>) => {
  //       return from(
  //         repo.find({
  //           // pagination
  //           ...(paginationParams && { skip: page * +size, take: size }),
  //           // filtering
  //           where: {
  //             ...(title && { title: new RegExp(`.*${title}.*`, 'i') }),
  //             ...(genres && { genres }),
  //             // TODO: please, take a decision on that
  //             // ...(isAdult && { isAdult }),
  //             // TODO: to implement this
  //             //...(ended && { ended: true }),
  //           },
  //           // sorting
  //           ...(sortingParams && {
  //             order: {
  //               ...(latest && { next_release_date: ordering }),
  //               ...(rank && { imdb_average_rank: ordering }),
  //               ...(popularity && { countLists: ordering }),
  //             },
  //           }),
  //         })
  //       );
  //     })
  //   );
  // }

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

  addFromDto(tvShowDTO: TvShowDTO): void {
    this.add(this.getEntityFromDTO(tvShowDTO));
  }

  async load(tvShowDTOs: TvShowDTO[]): Promise<void> {
    try {
      const c = await getConnection();
      const repo = c.getRepository(TvShow);

      await repo.save(this.getEntitiesFromDTOs(tvShowDTOs));
    } catch (e) {
      console.error(`err: ${e}`);
    }
  }

  private getEntitiesFromDTOs(tvShowDTOs: TvShowDTO[]): TvShow[] {
    return tvShowDTOs.map(this.getEntityFromDTO);
  }
}
