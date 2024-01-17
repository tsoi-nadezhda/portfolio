import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
let dialogsData = [
  { id: 1, name: "Tsoi" },
  { id: 2, name: "Jek" },
  { id: 3, name: "Lubava" },
  { id: 4, name: "Verka" },
  { id: 5, name: "Viktor" },
]
let messagesData = [
  { id: 1, message: "Hi" },
  { id: 2, message: "How are you?" },
  { id: 3, message: "Thank you" },
  { id: 4, message: "Bye" },
  { id: 5, message: "Bye" },
]
let postData = [
  { id: 1, message: "Hi! How are you?", likeCount: 15 },
  { id: 2, message: "It's my first post", likeCount: 20 }
]
ReactDOM.render(
  <React.StrictMode>
    <App dialogsData={dialogsData}  messagesData={messagesData} postData={postData}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
