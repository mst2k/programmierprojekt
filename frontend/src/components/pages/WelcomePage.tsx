import '@/App.css'
import { useTranslation } from 'react-i18next';

import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

import {useState} from "react";



function WelcomePage() {
    const [count, setCount] = useState(0)
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-screen w-screen">
            <header>
                <NavigationMenuDemo></NavigationMenuDemo>
            </header>
            <div className="flex flex-1">
                <main className="flex-1 p-4">
                    {t('title')}
                    <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                    </div>
                </main>
            </div>

        </div>

    )
}

export default WelcomePage
