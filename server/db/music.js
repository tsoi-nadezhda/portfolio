const pool = require("./pool");

const TRACK_FIELDS = `track_id, name, artist, album, image, audio, duration, share_url`;

function mapTrack(row) {
    return {
        id: row.track_id,
        name: row.name,
        artist: row.artist,
        album: row.album,
        image: row.image,
        audio: row.audio,
        duration: row.duration,
        url: row.share_url,
    };
}

async function getAlbum(userId) {
    const result = await pool.query(
        `SELECT ${TRACK_FIELDS}
         FROM album_tracks
         WHERE user_id = $1
         ORDER BY saved_at DESC`,
        [userId]
    );
    return result.rows.map(mapTrack);
}

async function saveAlbumTrack(userId, track) {
    const result = await pool.query(
        `INSERT INTO album_tracks
            (user_id, track_id, name, artist, album, image, audio, duration, share_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (user_id, track_id) DO UPDATE SET
            name = EXCLUDED.name,
            artist = EXCLUDED.artist,
            album = EXCLUDED.album,
            image = EXCLUDED.image,
            audio = EXCLUDED.audio,
            duration = EXCLUDED.duration,
            share_url = EXCLUDED.share_url,
            saved_at = NOW()
         RETURNING ${TRACK_FIELDS}`,
        [
            userId,
            track.id,
            track.name,
            track.artist,
            track.album,
            track.image,
            track.audio,
            track.duration,
            track.url,
        ]
    );
    return mapTrack(result.rows[0]);
}

async function removeAlbumTrack(userId, trackId) {
    const result = await pool.query(
        "DELETE FROM album_tracks WHERE user_id = $1 AND track_id = $2",
        [userId, trackId]
    );
    return result.rowCount > 0;
}

module.exports = { getAlbum, saveAlbumTrack, removeAlbumTrack };
