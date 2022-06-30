import { ReplyType } from '../utils/sharedTypes'


const handleReply = async <T>(response: Response): Promise<ReplyType<T>> => {
    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: T = await response.json()
    return {
        isSuccess: true,
        data
    }
}

export default handleReply
