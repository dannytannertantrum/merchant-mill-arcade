import { Type } from '@sinclair/typebox'

const SoftDeleteSchema = Type.Object({
    message: Type.String()
})

type ReplyMessage<T> = {
    message: string
    data?: T
}

export {
    ReplyMessage,
    SoftDeleteSchema
}
