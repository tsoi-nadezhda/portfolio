import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import state from "./redux/state"
import {addPost,updatePostMessage,sendMessage, updateTextMessage,subscribe} from "./redux/state"

// import addPost from "./redux/state"
let renderEntireTree=(state)=>{
    console.log(state)
    ReactDOM.render(
      <React.StrictMode>
        <App state={state} addPost={addPost} updatePostMessage={updatePostMessage} sendMessage={sendMessage} updateTextMessage={updateTextMessage}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
console.log(state)
renderEntireTree(state);
subscribe(renderEntireTree)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
