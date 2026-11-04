// Преобразование строк БД в объекты API и общий SELECT пользователей.

function relationFields(row) {
    const followed = Boolean(row.followed);
    const followsMe = Boolean(row.follows_me);
    return { followed, followsMe, isFriend: followed && followsMe };
}

function toUser(row) {
    return {
        id: row.id,
        name: row.name,
        uniqueUrlName: row.unique_url_name,
        photos: { small: row.photo_small, large: row.photo_large },
        status: row.status,
        aboutMe: row.about_me,
        lookingForAJob: row.looking_for_a_job,
        lookingForAJobDescription: row.looking_for_a_job_description,
        ...relationFields(row),
    };
}

function toProfile(row) {
    return {
        aboutMe: row.about_me,
        contacts: {
            facebook: row.facebook,
            website: row.website,
            vk: row.vk,
            twitter: row.twitter,
            instagram: row.instagram,
            youtube: row.youtube,
            github: row.github,
            mainLink: row.main_link,
        },
        lookingForAJob: row.looking_for_a_job,
        lookingForAJobDescription: row.looking_for_a_job_description,
        fullName: row.full_name,
        userId: row.user_id,
        photos: { small: row.photo_small, large: row.photo_large },
        ...relationFields(row),
    };
}

const userSelect = `
    SELECT u.id, u.name, u.status, u.unique_url_name, u.photo_small, u.photo_large,
           p.about_me, p.looking_for_a_job, p.looking_for_a_job_description,
           EXISTS (
               SELECT 1 FROM follows f
               WHERE f.follower_id = $1 AND f.followed_id = u.id
           ) AS followed,
           EXISTS (
               SELECT 1 FROM follows f
               WHERE f.follower_id = u.id AND f.followed_id = $1
           ) AS follows_me
    FROM users u
    JOIN profiles p ON p.user_id = u.id
`;

module.exports = { toUser, toProfile, userSelect };
