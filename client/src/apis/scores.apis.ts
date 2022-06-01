import { AllScoresData, ScoreData } from '../../../common/scores.types'
import { BASE_URL } from '../utils/constants'
import { ReplyType } from '../utils/sharedTypes'


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

const getScores = async (): Promise<ReplyType<AllScoresData>> => {
    const response = await fetch(`${BASE_URL}/scores`)

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
    getScore,
    getScores
}
