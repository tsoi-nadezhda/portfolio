const config = require("../config");
const db = require("../db");
const { loadUser, requireAuth } = require("../middleware/auth");
const { ok, fail, wrap, text } = require("../http");
const rateLimit = require("../rateLimit");

const router = require("express").Router();
const PAGE_SIZE = 12;

const jamendoUrl = (value, max) => {
    const raw = text(value, max);
    if (!raw) return "";
    let url;
    try {
        url = new URL(raw);
    } catch {
        return null;
    }
    const host = url.hostname;
    if (url.protocol !== "https:" || (host !== "jamendo.com" && !host.endsWith(".jamendo.com"))) return null;
    return url.toString();
};

const readTrack = (body) => {
    const source = body || {};
    const id = text(source.id, 12);
    if (!/^\d{1,12}$/.test(id)) return { error: "Track is invalid" };
    const name = text(source.name, 200);
    const artist = text(source.artist, 200);
    const album = text(source.album, 200);
    const audio = jamendoUrl(source.audio, 500);
    const image = source.image ? jamendoUrl(source.image, 500) : "";
    const url = source.url ? jamendoUrl(source.url, 500) : "";
    const duration = Math.min(Math.max(Number(source.duration) || 0, 0), 86400);
    if (!name || !artist) return { error: "Track is invalid" };
    if (!audio || image === null || url === null) return { error: "Track is invalid" };
    return { track: { id, name, artist, album, image, audio, duration, url } };
};

router.use(loadUser);

router.get("/tracks", rateLimit({ windowMs: 60 * 1000, max: 60 }), wrap(async (req, res) => {
    if (!config.JAMENDO_CLIENT_ID) return res.json(fail("Music search is not configured"));
    const search = text(req.query.search, 80);
    const offset = Math.min(Math.max(Number(req.query.offset) || 0, 0), 2000);
    const params = new URLSearchParams({
        client_id: config.JAMENDO_CLIENT_ID,
        format: "json",
        limit: String(PAGE_SIZE),
        offset: String(offset),
        audioformat: "mp32",
        imagesize: "200",
    });
    if (search) params.set("search", search);
    else params.set("order", "popularity_total");

    let response;
    try {
        response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params}`, {
            signal: AbortSignal.timeout(8000),
        });
    } catch {
        return res.json(fail("Music service is unavailable"));
    }
    if (!response.ok) return res.json(fail("Music service is unavailable"));
    const body = await response.json();
    if (!body.headers || body.headers.status !== "success") {
        return res.json(fail((body.headers && body.headers.error_message) || "Music service is unavailable"));
    }
    const results = Array.isArray(body.results) ? body.results : [];
    const tracks = results.filter((track) => track.audio).map((track) => ({
        id: String(track.id),
        name: track.name || "Untitled",
        artist: track.artist_name || "Unknown artist",
        album: track.album_name || "",
        image: track.image || track.album_image || "",
        audio: track.audio,
        duration: Number(track.duration) || 0,
        url: track.shareurl || "",
    }));
    res.set("Cache-Control", "no-store");
    res.json(ok({
        tracks,
        search,
        offset,
        limit: PAGE_SIZE,
        hasMore: results.length === PAGE_SIZE,
    }));
}));

router.get("/album", requireAuth, wrap(async (req, res) => {
    res.json(ok({ tracks: await db.getAlbum(req.user.id) }));
}));

router.post("/album", requireAuth, wrap(async (req, res) => {
    const parsed = readTrack(req.body);
    if (parsed.error) return res.json(fail(parsed.error));
    res.json(ok({ track: await db.saveAlbumTrack(req.user.id, parsed.track) }));
}));

router.delete("/album/:trackId", requireAuth, wrap(async (req, res) => {
    if (!/^\d{1,12}$/.test(req.params.trackId)) return res.json(fail("Track is invalid"));
    const removed = await db.removeAlbumTrack(req.user.id, req.params.trackId);
    if (!removed) return res.json(fail("Track is not in your album"));
    res.json(ok());
}));

module.exports = router;
