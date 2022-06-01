import { Static, Type } from '@sinclair/typebox'

const AllScoresSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        gameId: Type.String(),
        initials: Type.String(),
        isDeleted: Type.Boolean(),
        score: Type.Integer(),
        createdAt: Type.String(),
        updatedAt: Type.Union([Type.String(), Type.Null()])
    })
)
const ScoreSchema = Type.Object({
    id: Type.String(),
    gameId: Type.String(),
    isDeleted: Type.Boolean(),
    initials: Type.String(),
    score: Type.Integer(),
    createdAt: Type.String(),
    updatedAt: Type.Union([Type.String(), Type.Null()]),
})

interface ScoreRequestBody {
    id: string | undefined
    initials: string | undefined
    score: number | undefined
}

interface ScoreRequestBodyWithGame extends ScoreRequestBody {
    gameId: string
}

type ScoreData = Static<typeof ScoreSchema>
type AllScoresData = Static<typeof AllScoresSchema>

export {
    AllScoresData,
    AllScoresSchema,
    ScoreData,
    ScoreRequestBody,
    ScoreRequestBodyWithGame,
    ScoreSchema
}
