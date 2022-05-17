import { AllGamesData } from "../../../common/games.types"


const getGames = async () => {
    const response = await fetch(`${process.env.BASE_URL}/games`)
    const data: AllGamesData = await response.json()

    return data
}

export default getGames
