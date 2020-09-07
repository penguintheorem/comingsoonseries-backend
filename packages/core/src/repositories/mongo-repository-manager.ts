import { EntityManager, Repository } from 'typeorm';
import { RepositoryManager } from './repository-manager.abstract';
import { Observable } from 'rxjs';
import { pluck, map, tap } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoRepositoryManager extends RepositoryManager {
  constructor() {
    super();
  }

  getEntityManager(): Observable<EntityManager> {
    return RepositoryManager.getConnection().pipe(pluck('mongoManager'));
  }

  getRepository<T>(entity: string | Function): Observable<Repository<T>> {
    return RepositoryManager.getConnection().pipe(
      map(connection => connection.getMongoRepository(entity)),
    ) as Observable<Repository<T>>;
  }
}
