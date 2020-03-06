import { Observable } from 'rxjs';
import { TvShowRepository } from '@comingsoonseries/core/repositories';
export declare class TvShowLoaderService {
    private readonly _tvShowRepository;
    static readonly root: string;
    private dtosMap;
    constructor(_tvShowRepository: TvShowRepository);
    load(): void;
    loadTvShows(names$: Observable<string>): Observable<any>;
    addRatings(names$: Observable<string>): Observable<any>;
    addCountry(names$: Observable<string>): Observable<any>;
    getSourceFileNames(): Observable<string>;
    private getStreamAsCallbacks;
    private getTvShowDTO;
    private buildDTOs;
    private addRatingsToDTO;
    private addCountryToDTO;
}
