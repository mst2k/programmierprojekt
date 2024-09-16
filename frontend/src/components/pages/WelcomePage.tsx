import '@/App.css'

// import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

import {useState} from "react";
import { gmplStringTransp } from '@/interfaces/TestData';
import { ProblemEditor } from '../ui/custom/ProblemEditor/ProblemEditor';



function WelcomePage() {
    const [code, setCode] = useState(gmplStringTransp);
    return (
        <div className='h-screen'>
                <ProblemEditor problemFormat='GMPL' value={code} onChange={(e) => setCode} />
        </div>
    )
}

export default WelcomePage
