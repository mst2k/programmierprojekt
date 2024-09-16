import '@/App.css'
import { useTranslation } from 'react-i18next';

// import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

import {useState} from "react";
import { GMPLEditor } from '@/grammar/GMPLEditor';
import { gmpl2String } from '@/interfaces/TestData';



function WelcomePage() {
    const [count, setCount] = useState(0)
    const { t } = useTranslation();
    const [code, setCode] = useState(gmpl2String)
    return (
        <div className="flex flex-col h-screen w-screen">
            
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

            <br/>
            <br/>
            <br/>

            <div>
      <h1>GMPL Editor</h1>
      <GMPLEditor value={code} onChange={setCode} />
    </div>

        </div>
    )
}

export default WelcomePage
