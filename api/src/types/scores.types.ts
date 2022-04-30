import { Static, Type } from '@sinclair/typebox'

const AllScoresSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        initials: Type.String(),
        isDeleted: Type.Boolean(),
        score: Type.Integer(),
        game: Type.String(),
        createdAt: Type.String(),
        updatedAt: Type.String()
    })
)
const ScoreSchema = Type.Object({
    id: Type.String(),
    initials: Type.String(),
    isDeleted: Type.Boolean(),
    score: Type.Integer(),
    game: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String()
})

interface ScoreRequestBody {
    id: string | undefined
    initials: string | undefined
    score: number | undefined
}

interface ScoreRequestBodyWithGame extends ScoreRequestBody {
    game: string
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
