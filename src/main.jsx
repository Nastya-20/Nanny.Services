import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './firebase';
import App from './components/App/App';
import { AuthProvider } from "./components/AuthContext";
import './index.css';

const savedTheme = localStorage.getItem('theme') || 'theme-red';
document.documentElement.className = savedTheme;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
