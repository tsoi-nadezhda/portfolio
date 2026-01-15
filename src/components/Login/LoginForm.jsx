import { useForm } from 'react-hook-form';
import s from "./Login.module.css"

const LoginForm = (props) => {
    const { register, getValues, handleSubmit, formState: { errors } } = useForm();

    return <div className={s.loginForm}>
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <div className={s.inputField}>
                <label>Email</label>
                <input type="email"{...register('email', { required: true })} />
            </div>
            <div className={s.inputField}>
                <label>Password</label>
                <input type="password"{...register('password', {
                    required: true
                })} />
            </div>
            <div className={`${s.inputField} ${s.remember}`}>
                <div>Remember me</div>
                <input type="checkbox"{...register('rememberMe', {
                    required: true
                })} />
            </div>
            <button type="submit">Sign In</button>
        </form>


    </div>

}
export default LoginForm