interface ReplySuccess<T> {
    isSuccess: true
    data: T
}
interface ReplyFailure<E = Error> {
    isSuccess: false
    reason: E | string
}

type ReplyType<T, E = Error> = ReplySuccess<T> | ReplyFailure<E>

type BaseActionType =
    | { type: 'FETCH_ERROR'; isLoading: boolean; error: ReplyFailure<Error> }
    | { type: 'FETCH_IN_PROGRESS'; isLoading: boolean; }


export {
    BaseActionType,
    ReplySuccess,
    ReplyFailure,
    ReplyType
}
