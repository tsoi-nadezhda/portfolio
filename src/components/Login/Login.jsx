
import LoginForm from './LoginForm';
import { Navigate } from 'react-router-dom';

const Login = (props) => {

    console.log(props, "FGHJK")
    if (props.state.isAuth === true) return <Navigate to={"/profile"}></Navigate>
    const onSubmit = (data) => {
        console.log('data', data);
        const { email, password, rememberMe } = data;
        props.state.logIn(email, password, rememberMe)
    };
    return <LoginForm onSubmit={onSubmit}></LoginForm>

}
export default Login