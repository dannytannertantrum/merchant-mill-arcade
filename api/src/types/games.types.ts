import { Static, Type } from '@sinclair/typebox'

const AllGamesSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        description: Type.Union([Type.String(), Type.Null()]),
        imageUrl: Type.Union([Type.String(), Type.Null()]),
        isDeleted: Type.Boolean(),
        slug: Type.String(),
        title: Type.String(),
        createdAt: Type.String(),
        updatedAt: Type.Union([Type.String(), Type.Null()]),
    })
)
const GameSchema = Type.Object({
    id: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    imageUrl: Type.Union([Type.String(), Type.Null()]),
    isDeleted: Type.Boolean(),
    slug: Type.String(),
    title: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.Union([Type.String(), Type.Null()]),
})

interface GameRequestBody {
    id: string | undefined
    description: string | undefined
    imageUrl: string | undefined
    title: string
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
