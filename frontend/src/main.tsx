import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerLicense } from '@syncfusion/ej2-base';
import { DashboardProvider } from './context/DashboardContext.tsx';
import { ThemeProvider } from '@material-tailwind/react';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JFaF1cX2hIf0x+WmFZfVtgcF9FaVZSTGY/P1ZhSXxWd0RjWH5Yc31WTmlbVUd9XEM=');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
    <DashboardProvider>
      <App />
    </DashboardProvider>
    </ThemeProvider>
  </StrictMode>,
)
