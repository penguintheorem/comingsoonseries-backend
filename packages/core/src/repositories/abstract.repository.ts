import { ObjectId } from 'mongodb';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UpdateResult, ObjectID } from 'typeorm';
import { MongoRepositoryManager } from './mongo-repository-manager';

export abstract class AbstractRepository<T> {
  protected readonly entityName: string;

  constructor(protected readonly _manager: MongoRepositoryManager) {}

  count(): Observable<number> {
    return this._manager
      .getRepository<T>(this.entityName)
      .pipe(switchMap(repo => from(repo.count())));
  }

  find(id: string): Observable<T> {
    return this._manager.getRepository<T>(this.entityName).pipe(
      switchMap(repo => from(repo.find({ where: { _id: new ObjectId(id) } }))),
      map(results => results[0]),
    );
  }

  create(obj: T): Observable<T> {
    return this._manager.getRepository<T>(this.entityName).pipe(
      switchMap(repo => from(repo.save(obj))),
      map(() => obj),
    );
  }

  update(id: string, obj: T): Observable<T> {
    return this._manager.getRepository<T>(this.entityName).pipe(
      switchMap(repo => repo.update(id, obj)),
      map((updateResult: UpdateResult) => updateResult[0] as T),
    );
  }

  delete(id: string): Observable<T> {
    return this._manager.getRepository<T>(this.entityName).pipe(
      switchMap(repo => repo.delete(id)),
      map((updateResult: UpdateResult) => updateResult[0] as T),
    );
  }
}
