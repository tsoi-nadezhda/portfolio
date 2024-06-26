import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {addPost,updatePostMessage,sendMessage, updateTextMessage} from "./redux/state"
import reportWebVitals from './reportWebVitals';


export let renderEntireTree=(props)=>{
  ReactDOM.render(
    <React.StrictMode>
      <App state= {props} addPost={addPost} updatePostMessage={updatePostMessage} sendMessage={sendMessage} updateTextMessage={updateTextMessage}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
