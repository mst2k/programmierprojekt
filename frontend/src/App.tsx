import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<WelcomePage />} /> {/* Root route */}
              <Route path="/solver" element={<SolverPage />} /> {/* /solver route */}
          </Routes>
      </BrowserRouter>
  );
}


export default App
