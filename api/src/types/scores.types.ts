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

type AllScoresData = Static<typeof AllScoresSchema>
type ScoreData = Static<typeof ScoreSchema>

export {
    AllScoresData,
    ScoreData,
    AllScoresSchema,
    ScoreSchema
}
