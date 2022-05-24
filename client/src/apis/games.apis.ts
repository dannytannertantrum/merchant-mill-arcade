import { AllGamesData, GameData } from '../../../common/games.types'
import { BASE_URL } from '../utils/constants'
import { ReplyType } from '../utils/sharedTypes'


const addGame = async (title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
    const response = await fetch(`${BASE_URL}/games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, imageUrl })
    })

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: GameData = await response.json()
    return {
        isSuccess: true,
        data
    }
}

const getGame = async (id: string): Promise<ReplyType<GameData>> => {
    const response = await fetch(`${BASE_URL}/games/${id}`)

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: GameData = await response.json()
    return {
        isSuccess: true,
        data
    }
}

const getGames = async (): Promise<ReplyType<AllGamesData>> => {
    const response = await fetch(`${BASE_URL}/games`)

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: AllGamesData = await response.json()
    return {
        isSuccess: true,
        data
    }
}

export {
    addGame,
    getGame,
    getGames
}
