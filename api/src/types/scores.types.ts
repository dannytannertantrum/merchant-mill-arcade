import { Static, Type } from '@sinclair/typebox'

const AllScoresSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        initials: Type.String(),
        isDeleted: Type.Boolean(),
        score: Type.Integer(),
        game: Type.String(),
        createdAt: Type.Integer(),
        updatedAt: Type.Integer()
    })
)
const ScoreSchema = Type.Object({
    id: Type.String(),
    initials: Type.String(),
    isDeleted: Type.Boolean(),
    score: Type.Integer(),
    game: Type.String(),
    createdAt: Type.Integer(),
    updatedAt: Type.Integer()
})

type ScoreData = Static<typeof ScoreSchema>
type AllScoresData = Static<typeof AllScoresSchema>

export {
    AllScoresData,
    AllScoresSchema,
    ScoreData,
    ScoreSchema
}
