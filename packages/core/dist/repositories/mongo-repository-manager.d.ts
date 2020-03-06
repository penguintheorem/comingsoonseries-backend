import { EntityManager, Repository } from 'typeorm';
import { RepositoryManager } from './repository-manager.abstract';
import { Observable } from 'rxjs';
export declare class MongoRepositoryManager extends RepositoryManager {
    constructor();
    getEntityManager(): Observable<EntityManager>;
    getRepository<T>(entity: string | Function): Observable<Repository<T>>;
}
