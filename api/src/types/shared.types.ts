import { Type } from '@sinclair/typebox'

const SoftDeleteSchema = Type.Object({
    message: Type.String()
})

type ReplyMessage = {
    message: string
}

export {
    ReplyMessage,
    SoftDeleteSchema
}
