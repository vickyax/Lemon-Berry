//client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import "./responsive.css";
import { GoogleOAuthProvider } from '@react-oauth/google';


const client = import.meta.env.VITE_REACT_APP_googleauth;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={client}>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
