import { Static, Type } from '@sinclair/typebox'

const AllGamesSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        description: Type.String(),
        isDeleted: Type.Boolean(),
        slug: Type.String(),
        title: Type.String(),
        createdAt: Type.String(),
        updatedAt: Type.String()
    })
)
const GameSchema = Type.Object({
    id: Type.String(),
    description: Type.String(),
    isDeleted: Type.Boolean(),
    slug: Type.String(),
    title: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String()
})

interface GameRequestBody {
    id: string | undefined
    description: string | undefined
    title: string | undefined
}

type GameData = Static<typeof GameSchema>
type AllGamesData = Static<typeof AllGamesSchema>

export {
    AllGamesData,
    AllGamesSchema,
    GameData,
    GameRequestBody,
    GameSchema
}
