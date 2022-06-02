import { AllScoresData, ScoreData } from '../../../common/scores.types'
import { BASE_URL } from '../utils/constants'
import { ReplyType } from '../utils/sharedTypes'


const addScore = async (gameId: string, initials: string, score: number): Promise<ReplyType<ScoreData>> => {
    const response = await fetch(`${BASE_URL}/scores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId, initials, score })
    })

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: ScoreData = await response.json()
    return {
        isSuccess: true,
        data
    }
}

const getScore = async (id: string): Promise<ReplyType<ScoreData>> => {
    const response = await fetch(`${BASE_URL}/scores/${id}`)

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: ScoreData = await response.json()
    return {
        isSuccess: true,
        data
    }
}

const getScoresByGameId = async (id: string): Promise<ReplyType<AllScoresData>> => {
    const response = await fetch(`${BASE_URL}/scores-by-game/${id}`)

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: AllScoresData = await response.json()
    return {
        isSuccess: true,
        data
    }
}


export {
    addScore,
    getScore,
    getScoresByGameId
}
