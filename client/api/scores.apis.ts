import { AllScoresData, ScoreData } from '../../common/scores.types'
import { BASE_URL } from '../utils/constants'
import handleReply from './sharedReply'
import { ReplyType } from '../utils/sharedTypes'


const addScore = async (gameId: string, initials: string, score: number): Promise<ReplyType<ScoreData>> => {
    const response = await fetch(`${BASE_URL}/scores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId, initials, score })
    })

    const reply = await handleReply<ScoreData>(response)
    return reply
}

const deleteScore = async (scoreId: string): Promise<ReplyType<ScoreData>> => {
    const response = await fetch(`${BASE_URL}/scores/${scoreId}`, {
        method: 'DELETE'
    })

    const reply = await handleReply<ScoreData>(response)
    return reply
}

const editScore = async (id: string, initials: string, score: number): Promise<ReplyType<ScoreData>> => {
    const response = await fetch(`${BASE_URL}/scores/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, initials, score })
    })

    const reply = await handleReply<ScoreData>(response)
    return reply
}

const getScoresByGameId = async (id: string): Promise<ReplyType<AllScoresData>> => {
    const response = await fetch(`${BASE_URL}/scores-by-game/${id}`)

    const reply = await handleReply<AllScoresData>(response)
    return reply
}


export {
    addScore,
    deleteScore,
    editScore,
    getScoresByGameId
}
