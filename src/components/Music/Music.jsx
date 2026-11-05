import React, { useRef, useState } from "react"
import { connect } from "react-redux"
import { getAlbum, getTracks, removeTrack, saveTrack } from "../../redux/music_reducer"
import s from "./Music.module.css"

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
)
const PauseIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
)
const StopIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M6 6h12v12H6V6z" />
    </svg>
)
const HeartIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        {filled
            ? <path fill="currentColor" d="M12 20.4 10.55 19.1C6.1 15.1 3 12.24 3 8.75 3 6.1 5.1 4 7.75 4c1.54 0 3.04.74 4.25 1.9C13.21 4.74 14.71 4 16.25 4 18.9 4 21 6.1 21 8.75c0 3.49-3.1 6.35-7.55 10.35L12 20.4z" />
            : <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M12 19.2 11.1 18.4C7.2 14.9 4.6 12.5 4.6 9.4 4.6 7.1 6.4 5.3 8.7 5.3c1.28 0 2.51.6 3.3 1.55.79-.95 2.02-1.55 3.3-1.55 2.3 0 4.1 1.8 4.1 4.1 0 3.1-2.6 5.5-6.5 9L12 19.2z" />}
    </svg>
)

const formatTime = (seconds) => {
    const total = Number(seconds) || 0
    const minutes = Math.floor(total / 60)
    const rest = total % 60
    return `${minutes}:${String(rest).padStart(2, "0")}`
}

const Music = (props) => {
    const audioRef = useRef(null)
    const loadedId = useRef(null)
    const [query, setQuery] = useState("")
    const [tab, setTab] = useState("catalog")
    const [currentId, setCurrentId] = useState(null)
    const [mode, setMode] = useState("stopped")
    const savedIds = new Set(props.album.map((track) => track.id))
    const current = [...props.album, ...props.tracks].find((track) => track.id === currentId) || null

    const play = (track) => {
        const audio = audioRef.current
        if (!audio) return
        if (loadedId.current !== track.id) {
            audio.src = track.audio
            loadedId.current = track.id
        }
        setCurrentId(track.id)
        setMode("playing")
        audio.play().catch(() => setMode("paused"))
    }
    const pause = () => {
        if (audioRef.current) audioRef.current.pause()
        setMode("paused")
    }
    const stop = () => {
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audio.currentTime = 0
        }
        setMode("stopped")
    }

    const playback = (track) => {
        const playing = track.id === currentId && mode === "playing"
        return <>
            {playing
                ? <button type="button" className={`${s.icon} ${s.primary}`} aria-label="Pause" onClick={pause}><PauseIcon /></button>
                : <button type="button" className={`${s.icon} ${s.primary}`} aria-label="Play" onClick={() => play(track)}><PlayIcon /></button>}
            <button type="button" className={s.icon} aria-label="Stop" disabled={track.id !== currentId || mode === "stopped"} onClick={stop}><StopIcon /></button>
        </>
    }
    const heart = (track) => {
        const saved = savedIds.has(track.id)
        return <button
            type="button"
            className={saved ? `${s.icon} ${s.liked}` : s.icon}
            aria-label={saved ? "In my music" : "Save to my music"}
            aria-pressed={saved}
            disabled={props.savingId === track.id}
            onClick={() => saved ? props.removeTrack(track.id) : props.saveTrack(track)}
        ><HeartIcon filled={saved} /></button>
    }

    const renderTrack = (track) => {
        return <li key={track.id} className={track.id === currentId ? s.playing : s.track}>
            {track.image ? <img src={track.image} alt="" /> : <span className={s.cover} />}
            <div className={s.meta}>
                <div className={s.name}>{track.name}</div>
                <div className={s.artist}>{track.artist}{track.album ? ` · ${track.album}` : ""}</div>
            </div>
            <span className={s.time}>{formatTime(track.duration)}</span>
            <div className={s.controls}>
                {playback(track)}
                {heart(track)}
            </div>
        </li>
    }

    return <div className={s.page}>
        <div className={s.tabs} role="tablist">
            <button
                type="button"
                role="tab"
                aria-selected={tab === "catalog"}
                className={tab === "catalog" ? s.tabActive : s.tab}
                onClick={() => setTab("catalog")}
            >Music</button>
            <button
                type="button"
                role="tab"
                aria-selected={tab === "mine"}
                className={tab === "mine" ? s.tabActive : s.tab}
                onClick={() => setTab("mine")}
            >My music{props.album.length ? ` (${props.album.length})` : ""}</button>
        </div>
        <audio ref={audioRef} onEnded={() => setMode("stopped")} />
        {current ? <div className={s.now}>
            {current.image ? <img src={current.image} alt="" /> : <span className={s.cover} />}
            <div className={s.meta}>
                <div className={s.name}>{current.name}</div>
                <div className={s.artist}>{current.artist}</div>
            </div>
            <div className={s.controls}>
                {playback(current)}
                {heart(current)}
            </div>
        </div> : null}
        {tab === "mine" ? <section>
            {props.album.length
                ? <ul className={s.list}>{props.album.map(renderTrack)}</ul>
                : <p className={s.note}>Your music is empty. Press the heart on a track in the Music tab.</p>}
        </section> : <section>
            <form className={s.search} onSubmit={(event) => {
                event.preventDefault()
                props.getTracks(query.trim(), 0)
            }}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search tracks or artists"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <button type="submit" className={s.primary} disabled={props.isLoading}>Search</button>
            </form>
            {props.error ? <p className={s.error}>{props.error}</p> : null}
            {props.isLoading && !props.tracks.length ? <p className={s.note}>Loading tracks...</p> : null}
            {!props.isLoading && !props.error && !props.tracks.length ? <p className={s.note}>No tracks found.</p> : null}
            <ul className={s.list}>{props.tracks.map(renderTrack)}</ul>
            <div className={s.pages}>
                <button
                    type="button"
                    disabled={props.offset === 0 || props.isLoading}
                    onClick={() => props.getTracks(props.search, Math.max(props.offset - props.limit, 0))}
                >Previous</button>
                <button
                    type="button"
                    className={s.primary}
                    disabled={!props.hasMore || props.isLoading}
                    onClick={() => props.getTracks(props.search, props.offset + props.limit)}
                >Next</button>
            </div>
        </section>}
    </div>
}

class MusicContainer extends React.Component {
    componentDidMount() {
        this.props.getTracks("", 0)
        this.props.getAlbum()
    }
    render() {
        return <Music {...this.props} />
    }
}

const mapStateToProps = (state) => ({
    tracks: state.musicPage.tracks,
    search: state.musicPage.search,
    offset: state.musicPage.offset,
    limit: state.musicPage.limit,
    hasMore: state.musicPage.hasMore,
    isLoading: state.musicPage.isLoading,
    error: state.musicPage.error,
    album: state.musicPage.album,
    savingId: state.musicPage.savingId
})

export default connect(mapStateToProps, { getTracks, getAlbum, saveTrack, removeTrack })(MusicContainer)
