import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css';
import Header from './components/Header/Header';
import NavbarContainer from './components/Navbar/NavbarContainer';
import Profile from './components/Profile/Profile';
import Footer from './components/Footer';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import Music from './components/Music/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import MySidebarContainer from './components/Sidebar/MySidebarContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';

// const WrappedDialogs = function(props) {
//     // Конструкция "{...props}" нужна, чтобы не потерять
//     // параметры, переданные от компонента Route
//     return (<Home {...props} user={user} />);
// };
const App = () => {
    // debugger
    return (
    <BrowserRouter>
        <div className = "app-wrapper" >
            <Header />
            <NavbarContainer  />
            <div className = "app-wrapper-content">
                    <Routes>
                    {/* {console.log(props.state.sidebar.friendsData)} */}
                        <Route path = "/profile" element={<ProfileContainer />} /> 
                        <Route path = "/dialogs/*" element = { < DialogsContainer /> }/> 
                        <Route path = "/news" element = { < News /> }/> 
                        <Route path = "/music" element = { < Music /> }/> 
                        <Route path = "/settings" element = { < Settings /> }/> 
                        <Route path = "/friends/*" element = { < MySidebarContainer/> }/> 
                        <Route path = "/users/" element = { < UsersContainer/> }/> 
                    </Routes> 
            </div> 
            
        </div>
        </BrowserRouter> 

    )

}
export default App;