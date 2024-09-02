import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />}>
            <Route index element={<SolverPage />} />
            <Route path="solver" element={<SolverPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}


export default App
