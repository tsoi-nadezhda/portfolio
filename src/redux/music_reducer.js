import { musicAPI } from "../api/api"

const SET_TRACKS = "SET_TRACKS"
const SET_MUSIC_LOADING = "SET_MUSIC_LOADING"
const SET_MUSIC_ERROR = "SET_MUSIC_ERROR"
const SET_ALBUM = "SET_ALBUM"
const ADD_ALBUM_TRACK = "ADD_ALBUM_TRACK"
const REMOVE_ALBUM_TRACK = "REMOVE_ALBUM_TRACK"
const SET_SAVING = "SET_SAVING"
const SET_PLAYBACK = "SET_PLAYBACK"

export const playTrack = (track) => ({ type: SET_PLAYBACK, track, mode: "playing" })
export const pausePlayback = () => ({ type: SET_PLAYBACK, mode: "paused" })
export const stopPlayback = () => ({ type: SET_PLAYBACK, mode: "stopped" })
export const playbackEnded = () => ({ type: SET_PLAYBACK, mode: "stopped" })

let requestId = 0
const musicError = (response) => (response.data.messages && response.data.messages[0]) || "Something went wrong"

export const getTracks = (search = "", offset = 0) => (dispatch) => {
    const id = ++requestId
    dispatch({ type: SET_MUSIC_LOADING, isLoading: true })
    dispatch({ type: SET_MUSIC_ERROR, error: null })
    return musicAPI.getTracks(search, offset).then((response) => {
        if (id !== requestId) return
        if (response.data.resultCode === 0) {
            const data = response.data.data
            dispatch({
                type: SET_TRACKS,
                tracks: data.tracks,
                search: data.search,
                offset: data.offset,
                limit: data.limit,
                hasMore: data.hasMore
            })
            return
        }
        dispatch({ type: SET_MUSIC_ERROR, error: musicError(response) })
    }).catch(() => {
        if (id !== requestId) return
        dispatch({ type: SET_MUSIC_ERROR, error: "Cannot reach the server" })
    }).finally(() => {
        if (id === requestId) dispatch({ type: SET_MUSIC_LOADING, isLoading: false })
    })
}

export const getAlbum = () => (dispatch) => {
    return musicAPI.getAlbum().then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: SET_ALBUM, album: response.data.data.tracks })
        }
    }).catch(() => {})
}
export const saveTrack = (track) => (dispatch) => {
    dispatch({ type: SET_SAVING, savingId: track.id })
    dispatch({ type: SET_MUSIC_ERROR, error: null })
    return musicAPI.saveTrack(track).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: ADD_ALBUM_TRACK, track: response.data.data.track })
            return
        }
        dispatch({ type: SET_MUSIC_ERROR, error: musicError(response) })
    }).catch(() => {
        dispatch({ type: SET_MUSIC_ERROR, error: "Cannot reach the server" })
    }).finally(() => {
        dispatch({ type: SET_SAVING, savingId: null })
    })
}
export const removeTrack = (trackId) => (dispatch) => {
    return musicAPI.removeTrack(trackId).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: REMOVE_ALBUM_TRACK, trackId: String(trackId) })
            return
        }
        dispatch({ type: SET_MUSIC_ERROR, error: musicError(response) })
    }).catch(() => {
        dispatch({ type: SET_MUSIC_ERROR, error: "Cannot reach the server" })
    })
}

const initialState = {
    tracks: [],
    search: "",
    offset: 0,
    limit: 12,
    hasMore: false,
    isLoading: false,
    error: null,
    album: [],
    savingId: null,
    current: null,
    mode: "stopped"
}

const musicReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TRACKS:
            return {
                ...state,
                tracks: action.tracks,
                search: action.search,
                offset: action.offset,
                limit: action.limit,
                hasMore: action.hasMore
            }
        case SET_MUSIC_LOADING:
            return { ...state, isLoading: action.isLoading }
        case SET_MUSIC_ERROR:
            return { ...state, error: action.error }
        case SET_ALBUM:
            return { ...state, album: action.album }
        case ADD_ALBUM_TRACK: {
            const rest = state.album.filter((track) => track.id !== action.track.id)
            return { ...state, album: [action.track, ...rest] }
        }
        case REMOVE_ALBUM_TRACK:
            return { ...state, album: state.album.filter((track) => track.id !== action.trackId) }
        case SET_SAVING:
            return { ...state, savingId: action.savingId }
        case SET_PLAYBACK:
            return {
                ...state,
                current: action.track === undefined ? state.current : action.track,
                mode: action.mode
            }
        default:
            return state
    }
}

export default musicReducer
