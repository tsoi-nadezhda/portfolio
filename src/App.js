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
            <Navbar />
            <div className = "app-wrapper-content">
                    <Routes>
                    {/* render={()=>< Profile postData={props.postData} />} */}
                    {/* component={() => <Profile postData={props.postData} />} */}
                    {/* component={() => <Profile postData={props.postData} /> */}
                    {console.log(props.postData)}
                    
                        <Route path = "/profile" element={<Profile postData={props.postData}/>} /> 
                        <Route path = "/dialogs/*" element = { < Dialogs  dialogsData={props.dialogsData} messagesData={props.messagesData}/> }/> 
                        <Route path = "/news" element = { < News /> }/> 
                        <Route path = "/music" element = { < Music /> }/> 
                        <Route path = "/settings" element = { < Settings /> }/> 
                    </Routes> 
            </div> 
        </div>
        </BrowserRouter> 

    )

}
export default App;