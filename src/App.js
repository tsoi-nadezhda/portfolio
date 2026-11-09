import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import HeaderContainer from './components/Header/HeaderContainer';
import NavbarContainer from './components/Navbar/NavbarContainer';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import Music from './components/Music/Music';
import Player from './components/Music/Player';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import MySidebarContainer from './components/Sidebar/MySidebarContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import LoginContainer from './components/Login/LoginContainer';
import Confirm from './components/Login/Confirm';
import { connect } from 'react-redux';
import { initialize } from './redux/app_reducer';
import Spinner from "./components/Spinner/Spinner"

const GuestGate = ({ isAuth, children }) => {
    const { pathname } = useLocation()
    const signingIn = pathname === "/login" || pathname.startsWith("/confirm")
    if (!isAuth && !signingIn) return <Navigate to="/login" replace />
    return children
}

// const WrappedDialogs = function(props) {
//     // Конструкция "{...props}" нужна, чтобы не потерять
//     // параметры, переданные от компонента Route
//     return (<Home {...props} user={user} />);
// };
class App extends React.Component {
    // debugger
    componentDidMount() {
        this.props.initialize();
    }

    render() {
        // debugger
        if (!this.props.initialized) {
            return <Spinner />
        }
        const signedIn = this.props.isAuth
        return <Router>
            <div className={signedIn ? "app-wrapper" : "app-wrapper app-wrapper-guest"} >
                <HeaderContainer />
                {signedIn ? <NavbarContainer /> : null}

                <div className="app-wrapper-content">
                    {signedIn ? <Player /> : null}
                    <GuestGate isAuth={signedIn}>
                    <Routes>
                        <Route path="/profile" element={<ProfileContainer />} />
                        <Route path="/dialogs/:userId?" element={< DialogsContainer />} />
                        <Route path="/news" element={< News />} />
                        <Route path="/music" element={< Music />} />
                        <Route path="/settings" element={< Settings />} />
                        <Route path="/friends/*" element={< MySidebarContainer />} />
                        <Route path="/login" element={< LoginContainer />} />
                        <Route path="/confirm/:token" element={<Confirm />} />

                        {/* <Route path = "/users/:userId?" element = { < ProfileContainer/> }/>   */}
                        <Route path="/users/:userId" element={<ProfileContainer />} />
                        <Route path="/users" element={<UsersContainer />} />

                    </Routes>
                    </GuestGate>

                </div>

            </div>
        </Router >
    }
}
const mapStateToProps = (state) => {
    return {
        initialized: state.app.isInitialized,
        isAuth: state.auth.isAuth
    }
}
export default connect(mapStateToProps, { initialize })(App);