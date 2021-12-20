import { v4 as uuidv4 } from 'uuid'

import scores from '../../scores.js'


let allScores = scores

const getScores = (req, res) => {
    res.send(scores)
}
const getScore = (req, res) => {
    const { id } = req.params
    const scoreToGet = scores.find(score => score.id === id)

    res.send(scoreToGet)
}

const addScore = (req, res) => {
    const { initials, score, game } = req.body
    const scoreToAdd = {
        id: uuidv4(),
        initials,
        score,
        game
    }

    allScores = [...scores, scoreToAdd]

    res.code(201).send(scoreToAdd)
}

const deleteScore = (req, res) => {
    const { id } = req.params

    allScores = allScores.filter(score => score.id !== id)

    res.send({ message: `Score ${id} has been removed` })
}

const updateScore = (req, res) => {
    const { id } = req.params
    const { initials, score, game } = req.body

    allScores = allScores.map(score => (score.id === id ? { id, initials, score, game } : score))

    const scoreToUpdate = allScores.find(game => game.id === id)

    res.send(scoreToUpdate)
}

export {
    addScore,
    deleteScore,
    getScore,
    getScores,
    updateScore
}
