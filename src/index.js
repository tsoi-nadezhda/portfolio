import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from "./redux/redux_store"
import StoreContext from "./StoreContext"
// import addPost from "./redux/state"
let renderEntireTree=(state)=>{
  // debugger
    console.log(state)
    ReactDOM.render(
      <React.StrictMode>
        <StoreContext.Provider value={store}>
          <App />
        </StoreContext.Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
console.log(store.getState())
renderEntireTree(store.getState());
store.subscribe(()=>{
  let state =store.getState();
  renderEntireTree(state)
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
