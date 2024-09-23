import '@/App.css'

// import { NavigationMenuDemo } from "@/components/ui/navbar.tsx"

import {useEffect, useState} from "react";
import { gmplStringTransport } from '@/interfaces/TestData';
import { ProblemEditor } from '../ui/custom/ProblemEditor/ProblemEditor';
import "@/hooks/benchmark/benchmark.tsx";
import useBenchmark from "@/hooks/benchmark/benchmark.tsx";



function WelcomePage() {
    const [code, setCode] = useState(gmplStringTransport);

    useEffect(() => {
        console.log("Changed Code")
    }, [code])

    const {runBenchmark, benchmarkResults}  =useBenchmark()

    useEffect(() => {
        runBenchmark()
    }, []);

    return (
        <div className='h-screen w-screen'>
            <p>{JSON.stringify(benchmarkResults, null, 2)}</p>
                <ProblemEditor problemFormat='GMPL' value={code} onChange={setCode} />
        </div>

    )
}

export default WelcomePage
