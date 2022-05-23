import { CUSTOM_SEARCH_URL } from '../utils/constants'
import { ReplyType } from '../utils/sharedTypes'


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

const getImages = async (query: string): Promise<ReplyType<CustomSearchResults>> => {
    const response = await fetch(`${CUSTOM_SEARCH_URL}&q=${query}`)

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // "The Promise returned from fetch() won't reject on HTTP error status even if the response is an HTTP 404 or 500."
    // Rather than putting multiple catches all over the place, we can place one near our dispatch
    // And catch everything in one place
    if (!response.ok) {
        return Promise.reject({
            isSuccess: false,
            reason: await response.json()
        })
    }

    const data: CustomSearchResults = await response.json()
    return {
        isSuccess: true,
        data
    }
}

export {
    CustomSearchResults,
    getImages
}
