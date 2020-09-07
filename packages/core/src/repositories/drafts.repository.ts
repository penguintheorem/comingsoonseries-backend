import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PaginationParams } from '../models';
import { Draft } from './../entities';
import { AbstractRepository } from './abstract.repository';
import { MongoRepositoryManager } from './mongo-repository-manager';

@Injectable()
export class DraftsRepository extends AbstractRepository<Draft> {
  protected readonly entityName = 'Draft';

  constructor(protected readonly _manager: MongoRepositoryManager) {
    super(_manager);
  }

  getAll(
    paginationParams: PaginationParams,
    sortType: 'ASC' | 'DESC',
  ): Observable<Draft[]> {
    const { page, size } = paginationParams;

    return this._manager.getRepository<Draft>(this.entityName).pipe(
      switchMap(repo =>
        from(
          repo.find({
            // pagination
            ...(paginationParams ? { skip: page * size, take: size } : {}),
            // sorting by date (creation / updates)
            // @REFACTOR make field on which start the sorting dynamic
            ...(sortType ? { order: { lastUpdateDate: sortType } } : {}),
          }),
        ),
      ),
    );
  }
}
