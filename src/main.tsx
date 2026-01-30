import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DiceProvider } from './context/DiceContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DiceProvider>
      <App />
    </DiceProvider>
  </StrictMode>
);
