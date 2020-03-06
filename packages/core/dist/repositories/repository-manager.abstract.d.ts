import { Observable } from 'rxjs';
import { Connection, EntityManager, Repository } from 'typeorm';
export declare abstract class RepositoryManager {
    private static _connection;
    static getConnection(): Observable<Connection>;
    private static createConnection;
    abstract getEntityManager(): Observable<EntityManager>;
    abstract getRepository<T>(entity: string | Function): Observable<Repository<T>>;
}
