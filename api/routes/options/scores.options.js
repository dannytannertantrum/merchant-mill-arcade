import {
    addScore,
    deleteScore,
    getScore,
    getScores,
    updateScore
} from "../../controllers/scores.controller.js"

const Score = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        initials: { type: 'string' },
        score: { type: 'integer' },
        game: { type: 'string' }
    }
}

const getScoresOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Score
            }
        }
    },
    handler: getScores
}

const getScoreOptions = {
    schema: {
        response: {
            200: Score
        }
    },
    handler: getScore
}

const postScoreOptions = {
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
    handler: addScore
}

const deleteScoreOptions = {
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
    handler: deleteScore
}

const updateScoreOptions = {
    schema: {
        response: {
            200: Score
        }
    },
    handler: updateScore
}

export {
    deleteScoreOptions,
    getScoreOptions,
    getScoresOptions,
    postScoreOptions,
    updateScoreOptions
}
