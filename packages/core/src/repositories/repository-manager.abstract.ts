import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Connection,
  createConnection,
  EntityManager,
  Repository,
} from 'typeorm';
import { ormconfig } from '../ormconfig';

export abstract class RepositoryManager {
  private static _connection: Connection;

  static getConnection(): Observable<Connection> {
    if (!RepositoryManager._connection) {
      return RepositoryManager.createConnection();
    }
    return of(RepositoryManager._connection);
  }

  private static createConnection(): Observable<Connection> {
    return from(createConnection(ormconfig)).pipe(
      tap(connection => (RepositoryManager._connection = connection)),
    );
  }

  abstract getEntityManager(): Observable<EntityManager>;
  abstract getRepository<T>(
    entity: string | Function,
  ): Observable<Repository<T>>;
}
