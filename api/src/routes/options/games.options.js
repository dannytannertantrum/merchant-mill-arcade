import {
    addGame,
    deleteGame,
    getGame,
    getGames,
    updateGame
} from "../../controllers/games.controller.js"

// Game schema
const Game = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' }
    }
}

const getGamesOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Game
            }
        }
    },
    handler: getGames
}

const getGameOptions = {
    schema: {
        response: {
            200: Game
        }
    },
    handler: getGame
}

const postGameOptions = {
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
    handler: addGame
}

const deleteGameOptions = {
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
    handler: deleteGame
}

const updateGameOptions = {
    schema: {
        response: {
            200: Game
        }
    },
    handler: updateGame
}

export {
    deleteGameOptions,
    getGameOptions,
    getGamesOptions,
    postGameOptions,
    updateGameOptions
}
