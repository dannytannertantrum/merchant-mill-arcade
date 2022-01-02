import { Static, Type } from '@sinclair/typebox'

const AllGamesSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        description: Type.String(),
        isDeleted: Type.Boolean(),
        slug: Type.String(),
        title: Type.String(),
        createdAt: Type.Integer(),
        updatedAt: Type.Integer()
    })
)
const GameSchema = Type.Object({
    id: Type.String(),
    description: Type.String(),
    isDeleted: Type.Boolean(),
    slug: Type.String(),
    title: Type.String(),
    createdAt: Type.Integer(),
    updatedAt: Type.Integer()
})

type AllGamesData = Static<typeof AllGamesSchema>
type GameData = Static<typeof GameSchema>

export {
    AllGamesData,
    GameData,
    AllGamesSchema,
    GameSchema
}
