import games from '../games.js'

const getGames = (req, res) => {
    res.send(games)
}

const getGame = (req, res) => {
    const { id } = req.params
    const game = games.find(game => game.id === id)

    res.send(game)
}

export {
    getGames,
    getGame
}
