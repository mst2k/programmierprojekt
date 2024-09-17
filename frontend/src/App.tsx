import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
import ConverterPage from "@/components/pages/ConverterPage.tsx";
import { NavigationMenuDemo } from "@/components/ui/navbar.tsx";
import { Separator } from "@/components/ui/general/seperator.tsx";
import { Outlet } from 'react-router-dom';
import BenchmarkComponent from "@/components/pages/Benchmark.tsx";

const Layout = () => {
    return (
        <>
            <header>
                <NavigationMenuDemo></NavigationMenuDemo>
                <Separator className="my-1 mb-0"/>
            </header>

            <main>
                <Outlet/>
            </main>
        </>
    )
}

function App() {
  return (
      <HashRouter>
          <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<WelcomePage />} /> {/* Root route */}
              <Route path="/solver/" element={<SolverPage />} /> {/* /solver route */}
              <Route path="/converter" element={<ConverterPage />} /> {/* /solver route */}
              <Route path="/benchmark/" element={<BenchmarkComponent />} />
              </Route>
          </Routes>
      </HashRouter>

  );
}


export default App
