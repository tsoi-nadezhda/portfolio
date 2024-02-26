import s from "./Users.module.css"
const Users = (props) => {
    // debugger
    if (props.users.length === 0) {
        props.setUsers([{
            id: 1, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: false, name: "Nadya", surname: "Tsoi", city: "Ussuriysk", country: "Russia"
        },
        {
            id: 2, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: true, name: "Evgenii", surname: "Axel", city: "Rostov", country: "Russia"
        },
        {
            id: 3, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: true, name: "Lubov", surname: "Tsoi", city: "Rostov", country: "Russia"
        },
        {
            id: 4, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: false, name: "Oleg", surname: "HZ", city: "Kiev", country: "Ukraine"
        },
        {
            id: 5, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: false, name: "Vinni", surname: "Puh", city: "New York", country: "America"
        },
        {
            id: 6, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png",
            followed: true, name: "Puh", surname: "Maloi", city: "London", country: "England"
        }])
    }
    return <div className={s.users}>

        {props.users.map(u => <div key={u.id} className={s.user} >
            <div><img src={u.img} alt="" className={s.imgUser} />
                <div className={s.fullName}><span>{u.name}, {u.surname}</span></div>
                {u.followed ? <button onClick={() => props.unfollow(u.id)}>Unfollow</button> : <button onClick={() => props.follow(u.id)}>Follow</button>}
            </div>

            <div className={s.location}><span>{u.city}, {u.country}</span></div>
        </div>)}

    </div>
}

export default Users