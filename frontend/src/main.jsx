import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

 import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { StrictMode } from 'react';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
     <App />
     </Provider>
    <ToastContainer />
  </StrictMode>,
)
