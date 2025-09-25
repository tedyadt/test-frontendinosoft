import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import Home from './pages/inspection/home.jsx'
import 'preline/preline'
import React from "react";
import { DropdownsProvider } from "./context/DropdownsContext";



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DropdownsProvider>
      <Home />
    </DropdownsProvider>
  </React.StrictMode>,
)
