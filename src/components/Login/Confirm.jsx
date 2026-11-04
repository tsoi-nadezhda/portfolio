import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import { confirmToken } from "../../redux/auth_reducer"
import s from "./Login.module.css"

const Confirm = ({ token, confirmToken, isAuth, error }) => {
    const started = useRef(false)
    useEffect(() => {
        if (started.current || !token) return
        started.current = true
        confirmToken(token)
    }, [token, confirmToken])
    if (isAuth) return <Navigate to="/profile" />
    return <div className={s.loginForm}>
        <form>
            <h1>Confirm email</h1>
            <p className={s.note}>{error || "Checking your confirmation link..."}</p>
        </form>
    </div>
}

const ConfirmRoute = (props) => {
    const { token } = useParams()
    return <Confirm {...props} token={token} />
}

export default connect((state) => ({
    isAuth: state.auth.isAuth,
    error: state.auth.error
}), { confirmToken })(ConfirmRoute)
