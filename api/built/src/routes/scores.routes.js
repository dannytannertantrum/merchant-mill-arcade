"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scores_options_1 = require("./options/scores.options");
var scoreRoutes = function (fastify, options, done) {
    fastify.delete('/scores/:id', scores_options_1.deleteScoreOptions);
    done();
};
exports.default = scoreRoutes;
