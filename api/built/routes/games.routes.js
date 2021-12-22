"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var games_options_ts_1 = require("./options/games.options.ts");
var gameRoutes = function (fastify, options, done) {
    fastify.get('/games', games_options_ts_1.getGamesOptions);
    fastify.get('/games/:id', games_options_ts_1.getGameOptions);
    fastify.post('/games', games_options_ts_1.postGameOptions);
    fastify.delete('/games/:id', games_options_ts_1.deleteGameOptions);
    fastify.put('/games/:id', games_options_ts_1.updateGameOptions);
    done();
};
exports.default = gameRoutes;
