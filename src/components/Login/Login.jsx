import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoginForm from './LoginForm';
import { Navigate } from 'react-router-dom';
import s from "./Login.module.css"

const ConfirmCode = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return <div className={s.loginForm}>
        <form onSubmit={handleSubmit((data) => props.onSubmit(data.code))}>
            <h1>Confirm email</h1>
            <p className={s.note}>We sent a confirmation code to {props.email}. Enter it here, or open the link in that email.</p>
            {props.mailSent ? null : <p className={s.note}>No mail server is configured, so the code was printed in the API terminal.</p>}
            <div className={s.inputField}>
                <label>Code</label>
                <input inputMode="numeric" autoComplete="one-time-code" {...register("code", {
                    required: "Enter the code from the email",
                    pattern: { value: /^\d{6}$/, message: "The code is 6 digits" }
                })} />
                {errors.code ? <span>{errors.code.message}</span> : null}
            </div>
            {props.error ? <div className={s.error}>{props.error}</div> : null}
            <button type="submit">Approve email</button>
            <button type="button" className={s.switchMode} onClick={props.onBack}>Use another email</button>
        </form>
    </div>
}

const Login = (props) => {
    const [isSignUp, setSignUp] = useState(false)
    if (props.state.isAuth === true) return <Navigate to={"/profile"}></Navigate>
    if (props.state.pendingEmail) {
        return <ConfirmCode
            email={props.state.pendingEmail}
            mailSent={props.state.mailSent}
            error={props.state.error}
            onSubmit={(code) => props.state.confirmEmail(props.state.pendingEmail, code)}
            onBack={props.state.clearPendingEmail}
        />
    }
    const onSubmit = (data) => {
        if (isSignUp) {
            props.state.signUp(data.name, data.email, data.password)
            return
        }
        props.state.logIn(data.email, data.password, Boolean(data.rememberMe))
    };
    return <LoginForm
        key={isSignUp ? "sign-up" : "sign-in"}
        onSubmit={onSubmit}
        isSignUp={isSignUp}
        error={props.state.error}
        onSwitch={() => {
            props.state.clearAuthError()
            setSignUp(!isSignUp)
        }}
    ></LoginForm>
}
export default Login
