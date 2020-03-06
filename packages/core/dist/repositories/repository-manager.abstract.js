"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../ormconfig");
class RepositoryManager {
    static getConnection() {
        if (!RepositoryManager._connection) {
            return RepositoryManager.createConnection();
        }
        return rxjs_1.of(RepositoryManager._connection);
    }
    static createConnection() {
        return rxjs_1.from(typeorm_1.createConnection(ormconfig_1.ormconfig)).pipe(operators_1.tap(connection => console.log('connection: ', connection)), operators_1.tap(connection => (RepositoryManager._connection = connection)));
    }
}
exports.RepositoryManager = RepositoryManager;
//# sourceMappingURL=repository-manager.abstract.js.map