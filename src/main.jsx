import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LayoutWrapper from './layouts/LayoutWrapper.jsx'
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <LayoutWrapper>
      <App />
      </LayoutWrapper>
    </Router>
  </StrictMode>
);