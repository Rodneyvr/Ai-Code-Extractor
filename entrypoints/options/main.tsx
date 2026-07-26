import { createRoot } from 'react-dom/client';
import './options.css';
import App from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}