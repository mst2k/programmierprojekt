import '@/App.css'

// import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

import {useEffect, useState} from "react";
import { gmplStringTransport } from '@/interfaces/TestData';
import { ProblemEditor } from '../ui/custom/ProblemEditor/ProblemEditor';



function WelcomePage() {
    const [code, setCode] = useState(gmplStringTransport);

    useEffect(() => {
        console.log("Changed Code")
    }, [code])

    return (
        <div className='h-screen w-screen'>
                <ProblemEditor problemFormat='GMPL' value={code} onChange={setCode} />
        </div>
    )
}

export default WelcomePage
