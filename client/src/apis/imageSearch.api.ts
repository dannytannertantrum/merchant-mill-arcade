import { CUSTOM_SEARCH_URL } from '../utils/constants'


interface ResponseSuccess<T> {
    isSuccess: true
    searchResults: T
}
interface ResponseFailure<E = Error> {
    isSuccess: false
    reason: E
}
interface ImageProperties {
    kind: string
    title: string
    htmlTitle: string
    link: string
    displayLink: string
    snippet: string
    htmlSnippet: string
    mime: string
    fileFormat: string
}
interface CustomSearchResults {
    items: ImageProperties[]
}

type ResponseType<T, E = Error> = ResponseSuccess<T> | ResponseFailure<E>

const getImages = async (query: string): Promise<ResponseType<CustomSearchResults>> => {
    const response = await fetch(`${CUSTOM_SEARCH_URL}&q=${query}`)

    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const searchResults: CustomSearchResults = await response.json()

    return {
        isSuccess: true,
        searchResults
    }
}

export {
    CustomSearchResults,
    getImages,
    ResponseSuccess,
    ResponseFailure
}
