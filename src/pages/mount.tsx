import {StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import '../index.css';

/** Every page entry calls this once. */
export function mount(node: ReactNode) {
  // The pinned stages depend on scroll position; always start at the top
  // (an in-page #hash is honoured separately by startScroll).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  createRoot(document.getElementById('root')!).render(<StrictMode>{node}</StrictMode>);
}
