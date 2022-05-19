import { AllGamesData, GameData } from "../../../common/games.types"


const getGame = async (id: string) => {
    const response = await fetch(`${process.env.BASE_URL}/games/${id}`)
    const game: GameData = await response.json()

    return game
}

const getGames = async () => {
    const response = await fetch(`${process.env.BASE_URL}/games`)
    const data: AllGamesData = await response.json()

    return data
}

export {
    getGame,
    getGames
}
