"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoreOptions = exports.postScoreOptions = exports.getScoresOptions = exports.getScoreOptions = exports.deleteScoreOptions = void 0;
var scores_controller_ts_1 = require("../../controllers/scores.controller.ts");
var Score = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        initials: { type: 'string' },
        score: { type: 'integer' },
        game: { type: 'string' }
    }
};
var getScoresOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Score
            }
        }
    },
    handler: scores_controller_ts_1.getScores
};
exports.getScoresOptions = getScoresOptions;
var getScoreOptions = {
    schema: {
        response: {
            200: Score
        }
    },
    handler: scores_controller_ts_1.getScore
};
exports.getScoreOptions = getScoreOptions;
var postScoreOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['initials', 'score', 'game'],
            properties: {
                initials: { type: 'string' },
                score: { type: 'integer' },
                game: { type: 'string' }
            }
        },
        response: {
            201: Score
        }
    },
    handler: scores_controller_ts_1.addScore
};
exports.postScoreOptions = postScoreOptions;
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
    handler: scores_controller_ts_1.deleteScore
};
exports.deleteScoreOptions = deleteScoreOptions;
var updateScoreOptions = {
    schema: {
        response: {
            200: Score
        }
    },
    handler: scores_controller_ts_1.updateScore
};
exports.updateScoreOptions = updateScoreOptions;
