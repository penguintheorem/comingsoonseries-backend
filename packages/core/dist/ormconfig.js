"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tv_show_entity_1 = require("./entities/tv-show.entity");
exports.ormconfig = {
    type: 'mongodb',
    host: 'localhost',
    port: '27017',
    database: 'comingsoonseries',
    username: 'attilietto',
    password: encodeURIComponent('w&37Vom8LNGmr#76'),
    synchronize: true,
    logging: false,
    entities: [tv_show_entity_1.TvShow],
};
//# sourceMappingURL=ormconfig.js.map