import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initTauriDesktopRuntime} from './utils/tauriDesktop';

initTauriDesktopRuntime();

createRoot(document.getElementById('root')!).render(<App />);
