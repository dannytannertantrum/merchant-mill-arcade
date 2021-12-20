import { v4 as uuidv4 } from 'uuid'

import games from '../../games.js'


let allGames = games

const getGames = (req, res) => {
    res.send(games)
}
const getGame = (req, res) => {
    const { id } = req.params
    const game = games.find(game => game.id === id)

    res.send(game)
}

const addGame = (req, res) => {
    const { title, description } = req.body
    const game = {
        id: uuidv4(),
        title,
        description
    }

    allGames = [...games, game]

    res.code(201).send(game)
}

const deleteGame = (req, res) => {
    const { id } = req.params

    allGames = allGames.filter(game => game.id !== id)

    res.send({ message: `Game ${id} has been removed` })
}

const updateGame = (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    allGames = allGames.map(game => (game.id === id ? { id, title, description } : game))

    const gameToUpdate = allGames.find(game => game.id === id)

    res.send(gameToUpdate)
}

export {
    addGame,
    deleteGame,
    getGame,
    getGames,
    updateGame
}
