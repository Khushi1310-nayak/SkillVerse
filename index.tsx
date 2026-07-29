import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { loadLanguageResources } from './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
// Load all language translation files before first render, so no UI
// flashes untranslated keys while resources are still fetching.
loadLanguageResources().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
