import { Static, Type } from '@sinclair/typebox'

const AllGamesSchema = Type.Array(
    Type.Object({
        id: Type.String(),
        title: Type.String(),
        description: Type.String()
    })
)
const GameSchema = Type.Object({
    id: Type.String(),
    title: Type.String(),
    description: Type.String()
})

type AllGamesData = Static<typeof AllGamesSchema>
type GameData = Static<typeof GameSchema>

export {
    AllGamesData,
    GameData,
    AllGamesSchema,
    GameSchema
}
