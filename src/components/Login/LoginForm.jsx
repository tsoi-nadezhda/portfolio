import { useForm } from 'react-hook-form';
import s from "./Login.module.css"

const LoginForm = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return <div className={s.loginForm}>
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <h1>{props.isSignUp ? "Create account" : "Sign in"}</h1>
            {props.isSignUp ? <div className={s.inputField}>
                <label>Name</label>
                <input type="text" {...register('name', { required: "Name is required" })} />
                {errors.name ? <span>{errors.name.message}</span> : null}
            </div> : null}
            <div className={s.inputField}>
                <label>Email</label>
                <input type="email" {...register('email', { required: "Email is required" })} />
                {errors.email ? <span>{errors.email.message}</span> : null}
            </div>
            <div className={s.inputField}>
                <label>Password</label>
                <input type="password" {...register('password', {
                    required: "Password is required",
                    minLength: props.isSignUp ? { value: 4, message: "Password must be at least 4 characters" } : undefined
                })} />
                {errors.password ? <span>{errors.password.message}</span> : null}
            </div>
            {props.isSignUp ? null : <div className={`${s.inputField} ${s.remember}`}>
                <div>Remember me</div>
                <input type="checkbox" {...register('rememberMe')} />
            </div>}
            {props.error ? <div className={s.error}>{props.error}</div> : null}
            <button type="submit">{props.isSignUp ? "Sign up" : "Sign in"}</button>
            <button type="button" className={s.switchMode} onClick={props.onSwitch}>
                {props.isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
        </form>
    </div>
}
export default LoginForm
