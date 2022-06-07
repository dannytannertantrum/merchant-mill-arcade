import { AllGamesData, GameData } from '../../../common/games.types'
import { BASE_URL } from '../utils/constants'
import handleReply from './sharedReply'
import { ReplyType } from '../utils/sharedTypes'


const addGame = async (title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
    const response = await fetch(`${BASE_URL}/games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, imageUrl })
    })

    const reply = await handleReply<GameData>(response)
    return reply
}

const getGame = async (id: string): Promise<ReplyType<GameData>> => {
    const response = await fetch(`${BASE_URL}/games/${id}`)

    const reply = await handleReply<GameData>(response)
    return reply
}

const getGames = async (): Promise<ReplyType<AllGamesData>> => {
    const response = await fetch(`${BASE_URL}/games`)

    const reply = await handleReply<AllGamesData>(response)
    return reply
}

const updateGame = async (id: string, title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
    const response = await fetch(`${BASE_URL}/games/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, title, imageUrl })
    })

    const reply = await handleReply<GameData>(response)
    return reply
}

export {
    addGame,
    getGame,
    getGames,
    updateGame
}
