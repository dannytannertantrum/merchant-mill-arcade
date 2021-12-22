"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var fastify_swagger_1 = require("fastify-swagger");
var add_game_1 = require("./routes/games/add-game");
var add_score_1 = require("./routes/scores/add-score");
var get_game_1 = require("./routes/games/get-game");
var get_score_1 = require("./routes/scores/get-score");
var get_games_1 = require("./routes/games/get-games");
var get_scores_1 = require("./routes/scores/get-scores");
var delete_game_1 = require("./routes/games/delete-game");
var delete_score_1 = require("./routes/scores/delete-score");
var update_game_1 = require("./routes/games/update-game");
var update_score_1 = require("./routes/scores/update-score");
var server = (0, fastify_1.default)({ logger: true });
server.register(fastify_swagger_1.default, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'fastify-api routes',
            version: '4.13.0'
        },
    }
});
server.register(add_game_1.default);
server.register(add_score_1.default);
server.register(get_game_1.default);
server.register(get_score_1.default);
server.register(get_games_1.default);
server.register(get_scores_1.default);
server.register(delete_game_1.default);
server.register(delete_score_1.default);
server.register(update_game_1.default);
server.register(update_score_1.default);
exports.default = server;
