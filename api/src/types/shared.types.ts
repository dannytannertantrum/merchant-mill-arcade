import { Type } from '@sinclair/typebox'

const SoftDeleteSchema = Type.Object({
    message: Type.String()
})

export {
    SoftDeleteSchema
}
