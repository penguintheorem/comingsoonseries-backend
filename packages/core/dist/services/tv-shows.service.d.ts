import { Observable } from 'rxjs';
import { Product, TvShowDTO, SponsoredTvShowsLists } from '../models';
import { TvShowRepository } from '../repositories';
import { PaginationParams } from '../models/pagination-params';
import { Filters } from '../models/filters';
import { SortingParams } from '../models/sorting-params';
import { TvShowSuggestion } from '../models/dtos/tv-show-suggestion.dto';
import { TvShowPoster } from '../models/dtos/tv-show-poster.dto';
import { TvShow } from '../entities';
export declare class TvShowsService {
    private readonly tvShowRepository;
    constructor(tvShowRepository: TvShowRepository);
    find(tvShowId: string): Observable<TvShow>;
    getTvShowPosters(paginationParams: PaginationParams, filters: Filters, sortingParams: SortingParams): Observable<TvShowPoster[]>;
    getSponsoredTvShows(paginationParams: PaginationParams): Observable<SponsoredTvShowsLists>;
    getSuggestions(searchTerm: string): Observable<TvShowSuggestion[]>;
    getProducts(tvShowId: string): Observable<Product[]>;
    create(tvShowDto: TvShowDTO): Observable<TvShow>;
    update(tvShowId: string, tvShow: TvShow): Observable<TvShow>;
}
