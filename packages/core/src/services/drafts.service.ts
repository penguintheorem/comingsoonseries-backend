import { Injectable } from '@nestjs/common';
import { concat, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, reduce } from 'rxjs/operators';
import { PaginationParams } from '../models';
import { Draft } from './../entities/draft.entity';
import { ResultsWithPagination } from './../models/results-with-pagination';
import { DraftsRepository } from './../repositories/drafts.repository';
import { TvShowsService } from './tv-shows.service';

@Injectable()
export class DraftsService {
  constructor(
    private readonly draftsRepository: DraftsRepository,
    private readonly tvShowService: TvShowsService,
  ) {}

  getAll(
    paginationParams: PaginationParams,
    sortType: 'ASC' | 'DESC',
  ): Observable<ResultsWithPagination<Draft>> {
    return forkJoin({
      items: this.draftsRepository.getAll(paginationParams, sortType),
      count: this.draftsRepository.count(),
    }).pipe(
      map(({ items, count }) => ({
        items,
        paginationInfo: { count, size: paginationParams.size },
      })),
    );
  }

  // @REFACTOR with a serializer or investigate for better solutions
  create(draft: Draft): Observable<Draft> {
    const tvShow = {
      _id: draft.tvShow.id,
      ...draft.tvShow,
      next_release_date: new Date(draft.tvShow.next_release_date),
    };
    delete tvShow.id;
    return this.draftsRepository.create({
      ...draft,
      lastUpdateDate: new Date(draft.lastUpdateDate),
      tvShow,
    });
  }

  update(draftId: string, newDraft: Draft): Observable<Draft> {
    return this.draftsRepository.update(draftId, newDraft);
  }

  delete(draftId: string): Observable<Draft> {
    return this.draftsRepository.delete(draftId);
  }

  // returns the published draft or an error
  publish(draftId: string): Observable<Draft> {
    return this.draftsRepository.find(draftId).pipe(
      // draft tv show becomes the new tv show
      mergeMap((draft: Draft) => {
        const { tvShow } = draft;

        return concat(
          this.tvShowService.update(`${tvShow.id}`, tvShow),
          this.delete(draftId),
        ).pipe(reduce((prev, curr) => prev, draft));
      }),
    );
  }
}
