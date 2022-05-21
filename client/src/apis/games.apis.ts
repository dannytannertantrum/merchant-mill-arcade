import { AllGamesData, GameData } from '../../../common/games.types'
import FetchException from '../utils/custom-exceptions'


interface ResponseNotOk {
    error: string
    message: string
    statusCode: number
}
const returnResponseNotOk = ({ error, message, statusCode }: ResponseNotOk) => {
    throw new FetchException(error, message, statusCode)
}

const { BASE_URL } = process.env

const addGame = async (title: string): Promise<GameData> => {
    const response = await fetch(`${BASE_URL}/games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    })

    if (!response.ok) returnResponseNotOk(await response.json())

    const data: GameData = await response.json()
    return data
}

const getGame = async (id: string): Promise<GameData> => {
    const response = await fetch(`${BASE_URL}/games/${id}`)

    if (!response.ok) returnResponseNotOk(await response.json())

    const data: GameData = await response.json()
    return data
}

const getGames = async (): Promise<AllGamesData> => {
    const response = await fetch(`${BASE_URL}/games`)

    if (!response.ok) returnResponseNotOk(await response.json())

    const data: AllGamesData = await response.json()
    return data
}

export {
    addGame,
    getGame,
    getGames
}
