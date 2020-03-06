import { TvShowsService } from '@comingsoonseries/core/services';
import { Observable } from 'rxjs';
import { TvShowPoster } from '@comingsoonseries/core/models';
import { SponsoredTvShowsLists, Product, TvShowDTO } from '@comingsoonseries/core/models';
import { TvShowSuggestion } from '@comingsoonseries/core/models/dtos/tv-show-suggestion.dto';
import { TvShow } from '@comingsoonseries/core/entities';
export declare class TvShowsController {
    private readonly tvShowsService;
    constructor(tvShowsService: TvShowsService);
    getTvShowPosters(query: any): Observable<TvShowPoster[]>;
    getSponsoredTvShows(query: any): Observable<SponsoredTvShowsLists>;
    getTvShowSuggestions(query: any): Observable<TvShowSuggestion[]>;
    getTvShow(urlSegmentParams: {
        tvShowId: string;
    }): Observable<TvShow>;
    getProducts(urlSegmentParams: {
        tvShowId: string;
    }): Observable<Product[]>;
    create(tvShowDto: TvShowDTO): Observable<TvShow>;
    update(urlSegmentParams: {
        tvShowId: string;
    }, tvShow: TvShow): Observable<TvShow>;
}
