import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
function App() {
  return (
      <HashRouter>
          <Routes>

              <Route path="/" element={<WelcomePage />} /> {/* Root route */}
              <Route path="/solver" element={<SolverPage />} /> {/* /solver route */}
          </Routes>
      </HashRouter>
  );
}


export default App
