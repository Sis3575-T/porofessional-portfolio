import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const params = new URLSearchParams(window.location.search);
if (params.get("exclude_analytics") === "true") {
  localStorage.setItem("portfolio_analytics_exclude", "true");
} else if (params.get("exclude_analytics") === "false") {
  localStorage.removeItem("portfolio_analytics_exclude");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
