import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    font-size: 16px; scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1rem; font-weight: 400; line-height: 1.5;
    color: #1e293b; background-color: #f8fafc; overflow-x: hidden;
  }

  h1,h2,h3,h4,h5,h6 {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    font-weight: 700; line-height: 1.2; color: #0f172a; letter-spacing: -0.02em;
  }

  p { color: #64748b; line-height: 1.625; }

  a {
    color: #6366f1; text-decoration: none; transition: color 150ms ease;
    &:hover { color: #4f46e5; }
    &:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; border-radius: 4px; }
  }

  img { max-width: 100%; height: auto; display: block; }

  input, textarea, select, button { font-family: inherit; font-size: inherit; }

  button {
    cursor: pointer; border: none; background: none; padding: 0;
    &:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #a5b4fc; border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: #818cf8; }

  ::selection { background-color: #c7d2fe; color: #312e81; }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  .container {
    width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
    @media (min-width: 1024px) { padding: 0 2rem; }
  }

  .glass {
    background: rgba(255,255,255,0.7); backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.5);
  }
  .glass-dark {
    background: rgba(15,23,42,0.6); backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08);
  }
  .gradient-text {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  @keyframes fadeIn    { from{opacity:0}       to{opacity:1} }
  @keyframes slideUp   { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes scaleIn   { from{transform:scale(0.94);opacity:0}      to{transform:scale(1);opacity:1} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-16px)} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .animate-fade-in  { animation: fadeIn  0.4s ease-in-out; }
  .animate-slide-up { animation: slideUp 0.4s ease-out; }
  .animate-float    { animation: float   6s ease-in-out infinite; }
  .animate-pulse    { animation: pulse   2s cubic-bezier(0.4,0,0.6,1) infinite; }
  .animate-spin     { animation: spin    1s linear infinite; }

  @media (max-width: 640px)  { .hidden-mobile  { display: none !important; } }
  @media (min-width: 768px)  { .hidden-desktop { display: none !important; } }
`;