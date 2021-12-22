"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var fastify_swagger_1 = require("fastify-swagger");
var games_routes_ts_1 = require("./routes/games.routes.ts");
var scores_routes_ts_1 = require("./routes/scores.routes.ts");
var fastify = (0, fastify_1.default)({ logger: true });
fastify.register(fastify_swagger_1.default, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
        info: { title: 'fastify-api routes' }
    }
});
fastify.register(games_routes_ts_1.default);
fastify.register(scores_routes_ts_1.default);
exports.default = fastify;
