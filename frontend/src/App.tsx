import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
import ConverterPage from "@/components/pages/ConverterPage.tsx";
import { NavigationMenuDemo } from "@/components/ui/navbar.tsx";
import { Separator } from "@/components/ui/general/seperator.tsx";
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <header>
                <NavigationMenuDemo></NavigationMenuDemo>
                <Separator className="my-2 mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]"/>
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
              </Route>
          </Routes>
      </HashRouter>

  );
}


export default App
