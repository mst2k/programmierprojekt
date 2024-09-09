import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom';
import '@/App.css'
import { useTranslation } from 'react-i18next';
import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

function WelcomePage() {
    const [count, setCount] = useState(0)
    const { t } = useTranslation();
    return (
        <>
        <header>
            <NavigationMenuDemo></NavigationMenuDemo>
        </header>
                <div>
                    <a href="https://vitejs.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>

                <h1>{t('Welcome to React')}</h1>
            <Link to={"/solver"}>solver</Link>

        </>
    )
}

export default WelcomePage
