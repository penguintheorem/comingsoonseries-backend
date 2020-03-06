import { Observable } from 'rxjs';
import { TvShow } from '../entities/tv-show.entity';
import { TvShowSuggestion } from '../models/dtos/tv-show-suggestion.dto';
import { PaginationParams, Filters, SortingParams, Product, TvShowDTO } from '../models';
import { TvShowPoster } from '../models/dtos/tv-show-poster.dto';
import { MongoRepositoryManager } from './mongo-repository-manager';
export declare class TvShowRepository {
    private readonly _manager;
    constructor(_manager: MongoRepositoryManager);
    add(tvShow: TvShow): Observable<TvShow>;
    find(tvShowId: string): Observable<TvShow>;
    getSuggestions(searchTerm: string): Observable<TvShowSuggestion[]>;
    getTvShowPosters(paginationParams: PaginationParams, filters: Filters, sortingParams: SortingParams): Observable<TvShowPoster[]>;
    getProducts(tvShowId: string): Observable<Product[]>;
    update(tvShowId: string, newTvShow: TvShow): Observable<TvShow>;
    toTvShowSuggestions(tvShows: TvShow[]): TvShowSuggestion[];
    toTvShowGridItems(tvShows: TvShow[]): TvShowPoster[];
    getEntityFromDTO(tvShowDTO: TvShowDTO): TvShow;
    addFromDto(tvShowDTO: TvShowDTO): void;
    load(tvShowDTOs: TvShowDTO[]): Promise<void>;
    private getEntitiesFromDTOs;
}
