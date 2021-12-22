"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scores_options_ts_1 = require("./options/scores.options.ts");
var scoreRoutes = function (fastify, options, done) {
    fastify.get('/scores', scores_options_ts_1.getScoresOptions);
    fastify.get('/scores/:id', scores_options_ts_1.getScoreOptions);
    fastify.post('/scores', scores_options_ts_1.postScoreOptions);
    fastify.delete('/scores/:id', scores_options_ts_1.deleteScoreOptions);
    fastify.put('/scores/:id', scores_options_ts_1.updateScoreOptions);
    done();
};
exports.default = scoreRoutes;
