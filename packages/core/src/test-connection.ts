import { RepositoryManager } from './repositories';
import { TvShow } from './entities';

// if this doesn't work you need to find entities (ormconfig.ts)
// here: 'lib/entity/*{.js, .ts}'
RepositoryManager.getConnection().subscribe(conn => {});
