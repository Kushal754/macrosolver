// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MacroProvider } from './context/MacroContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MacroProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MacroProvider>
  </StrictMode>,
);