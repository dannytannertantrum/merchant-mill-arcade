const { BASE_URL, CUSTOM_SEARCH_ENGINE_ID, CUSTOM_SEARCH_API_KEY } = process.env

// For a list of query parameters and what they mean: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
const CUSTOM_SEARCH_ERROR = 'Custom search error'
const CUSTOM_SEARCH_URL = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&hq=arcade%20marquee&num=8&searchType=image`
const DEFAULT_MARQUEE = 'https://cdn.shopify.com/s/files/1/1125/0582/products/Mame_Arcade_Marquee_Pacman_maze_1200x1200.png'

const CREATE_GAME = 'CREATE_GAME'
const CREATE_SCORE = 'CREATE_SCORE'
const FETCH_ERROR = 'FETCH_ERROR'
const FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS'
const GET_GAME = 'GET_GAME'
const GET_GAMES = 'GET_GAMES'
const GET_IMAGES = 'GET_IMAGES'
const GET_SCORE = 'GET_SCORE'
const GET_SCORES = 'GET_SCORES'


export {
    BASE_URL,
    CREATE_GAME,
    CREATE_SCORE,
    CUSTOM_SEARCH_ERROR,
    CUSTOM_SEARCH_URL,
    DEFAULT_MARQUEE,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_GAME,
    GET_GAMES,
    GET_IMAGES,
    GET_SCORE,
    GET_SCORES
}
