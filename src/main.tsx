import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply stored theme immediately on script load to prevent flashing of style defaults
const savedTheme = localStorage.getItem("reyes_theme") || "monochrome";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

