import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HeaderContainer from './components/Header/HeaderContainer';
import NavbarContainer from './components/Navbar/NavbarContainer';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import Music from './components/Music/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import MySidebarContainer from './components/Sidebar/MySidebarContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import LoginContainer from './components/Login/LoginContainer';

// const WrappedDialogs = function(props) {
//     // Конструкция "{...props}" нужна, чтобы не потерять
//     // параметры, переданные от компонента Route
//     return (<Home {...props} user={user} />);
// };
const App = () => {
    // debugger
    return (
        <Router>
            <div className="app-wrapper" >
                <HeaderContainer />
                <NavbarContainer />

                <div className="app-wrapper-content">
                    <Routes>
                        <Route path="/profile" element={<ProfileContainer />} />
                        <Route path="/dialogs/*" element={< DialogsContainer />} />
                        <Route path="/news" element={< News />} />
                        <Route path="/music" element={< Music />} />
                        <Route path="/settings" element={< Settings />} />
                        <Route path="/friends/*" element={< MySidebarContainer />} />
                        <Route path="/login" element={< LoginContainer />} />

                        {/* <Route path = "/users/:userId?" element = { < ProfileContainer/> }/>   */}
                        <Route path="/users/:userId" element={<ProfileContainer />} />
                        <Route path="/users" element={<UsersContainer />} />

                    </Routes>

                </div>

            </div>
        </Router>
    )

}
export default App;