"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameOptions = exports.postGameOptions = exports.getGamesOptions = exports.getGameOptions = exports.deleteGameOptions = void 0;
var games_controller_1 = require("../../controllers/games.controller");
// Game schema
var Game = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' }
    }
};
var getGamesOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Game
            }
        }
    },
    handler: games_controller_1.getGames
};
exports.getGamesOptions = getGamesOptions;
var getGameOptions = {
    schema: {
        response: {
            200: Game
        }
    },
    handler: games_controller_1.getGame
};
exports.getGameOptions = getGameOptions;
var postGameOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['title'],
            properties: {
                title: { type: 'string' }
            }
        },
        response: {
            201: Game
        }
    },
    handler: games_controller_1.addGame
};
exports.postGameOptions = postGameOptions;
var deleteGameOptions = {
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
    handler: games_controller_1.deleteGame
};
exports.deleteGameOptions = deleteGameOptions;
var updateGameOptions = {
    schema: {
        response: {
            200: Game
        }
    },
    handler: games_controller_1.updateGame
};
exports.updateGameOptions = updateGameOptions;
