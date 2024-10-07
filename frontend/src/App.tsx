import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "@/components/pages/WelcomePage.tsx";
import SolverPage from "@/components/pages/SolverPage.tsx";
import ConverterPage from "@/components/pages/ConverterPage.tsx";
import { NavigationMenuDemo } from "@/components/ui/general/webBasic/navbar.tsx";
import { Separator } from "@/components/ui/seperator.tsx";
import { Outlet } from 'react-router-dom';
import Footer from "@/components/ui/general/webBasic/footer.tsx";
import AboutPage from './components/pages/AboutPage';
import BenchmarkComponent from './components/pages/Benchmark';
import { ThemeProvider } from './hooks/themeProvider.tsx';
import LicensePage from "@/components/pages/LicensePage.tsx";

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
            <Separator className="my-1 mb-0"/>
            <Footer></Footer>
        </>
    )
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
          <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<WelcomePage />} /> {/* Root route */}
              <Route path="/solver/" element={<SolverPage />} /> {/* /solver route */}
              <Route path="/converter" element={<ConverterPage />} /> {/* /converter route */}
              <Route path="/about" element={<AboutPage />} /> {/* about route */}
              <Route path="/benchmark" element={<BenchmarkComponent />} /> {/* about route */}
              <Route path="/license" element={<LicensePage />} /> {/* about route */}
            </Route>
          </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}


export default App