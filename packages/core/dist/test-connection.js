"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("./repositories");
const entities_1 = require("./entities");
repositories_1.RepositoryManager.getConnection().subscribe(conn => {
    console.log('conn: ', conn);
    console.log('repo: ', conn.getRepository(entities_1.TvShow));
});
//# sourceMappingURL=test-connection.js.map