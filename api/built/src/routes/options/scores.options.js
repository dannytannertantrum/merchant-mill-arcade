"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScoreOptions = void 0;
var scores_controller_1 = require("../../controllers/scores.controller");
var Score = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        initials: { type: 'string' },
        score: { type: 'integer' },
        game: { type: 'string' }
    }
};
var deleteScoreOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    handler: scores_controller_1.deleteScore
};
exports.deleteScoreOptions = deleteScoreOptions;
