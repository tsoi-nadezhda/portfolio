import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Footer from './components/Footer';
import Dialogs from './components/Dialogs/Dialogs';
import Music from './components/Music/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import MySidebar from './components/Sidebar/MySidebar';

// const WrappedDialogs = function(props) {
//     // Конструкция "{...props}" нужна, чтобы не потерять
//     // параметры, переданные от компонента Route
//     return (<Home {...props} user={user} />);
// };
const App = (props) => {
    console.log(props)
    return (
    <BrowserRouter>
        <div className = "app-wrapper" >
            <Header />
            <Navbar friendsData={props.state.sidebar.friendsData} />
            <div className = "app-wrapper-content">
                    <Routes>
                    {/* {console.log(props.state.sidebar.friendsData)} */}
                        <Route path = "/profile" element={<Profile postData={props.state.profilePage.postData} newPostText={props.state.profilePage.newPostText} dispatch={props.dispatch}/>} /> 
                        <Route path = "/dialogs/*" element = { < Dialogs  newMessage
={props.state.messagesPage.newMessage} dialogsData={props.state.messagesPage.dialogsData} messagesData={props.state.messagesPage.messagesData} me={props.state.messagesPage.me} dispatch={props.dispatch}/> }/> 
                        <Route path = "/news" element = { < News /> }/> 
                        <Route path = "/music" element = { < Music /> }/> 
                        <Route path = "/settings" element = { < Settings /> }/> 
                        <Route path = "/friends/*" element = { < MySidebar friendsData={props.state.sidebar.friendsData}/> }/> 
                    </Routes> 
            </div> 
            
        </div>
        </BrowserRouter> 

    )

}
export default App;