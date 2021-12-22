import { Static, Type } from '@sinclair/typebox'

const AllScoresSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        initials: Type.String(),
        score: Type.Integer(),
        game: Type.String()
    })
)
const ScoreSchema = Type.Object({
    id: Type.String(),
    initials: Type.String(),
    score: Type.Integer(),
    game: Type.String()
})

type AllScoresData = Static<typeof AllScoresSchema>
type ScoreData = Static<typeof ScoreSchema>

export {
    AllScoresData,
    ScoreData,
    AllScoresSchema,
    ScoreSchema
}
