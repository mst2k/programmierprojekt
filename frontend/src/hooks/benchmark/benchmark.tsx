// Annahme: Die Browser-Solver-Funktionen sind im globalen Scope verfügbar
import useSolver from "@/hooks/solvers/useSolver.tsx";
import {lpString} from "@/interfaces/TestData.tsx";
import {useState} from "react";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";

function useBenchmark() {
    const problemType="GMPL"
    const {solve:solveGlpkHgourvest} = useSolver(" ", problemType, "GLPKHgourvest");
    const {solve:solveGlpkJavil} = useSolver(" ", problemType, "GLPKJavil")
    const {solve:solveHighs} = useSolver(" ", problemType, "Highs")
    const [benchmarkResults, setBenchmarkResults] = useState<any>(null)
    async function benchmarkAllSolvers(problem, problemType, bmLog:(string)=>void) {
        const browserSolvers = ['glpkHgourvest', 'glpkJavil', 'highs'];
        const results = {};

        // Browser Solvers
        for (const solver of browserSolvers) {
            console.log(`Running solver in browser: ${solver}`);
            bmLog(`Running solver in browser: ${solver}`);
            const start = performance.now();
            try {
                switch(solver) {
                    case 'glpkHgourvest':
                        await solveGlpkHgourvest(problem, problemType, "GLPKHgourvest")
                        break;
                    case 'glpkJavil':
                        await solveGlpkJavil(problem, problemType, "GLPKJavil");
                        break;
                    case 'highs':
                        await solveHighs(problem, problemType, "Highs");
                        break;
                }
                const end = performance.now();
                const executionTime = (end - start) / 1000; // Umrechnung in Sekunden
                results[solver] = executionTime;
            } catch (error) {
                console.error(`Error in browser solver ${solver}:`, error);
                results[solver] = 'Error';
            }
        }

        // API Solvers
        console.log(`Running solver via API`);
        bmLog(`Running solver via API`);
        try {
            const response = await fetch('http://localhost:8080/api/benchmark', {
                method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     problem: problem,
                     problem_type: problemType
                 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            results["glpk(Backend)"] = data["glpk"]["execution_time"];
            results["highs(Backend)"] = data["highs"]["execution_time"];
        } catch (error) {
            console.error(`Error in API solver:`, error);
        }
        return results;
    }
    async function runBenchmark(problem?:string, problemType?:ProblemFormats, bmLog?:(string)=>void) {
        if(!problem){
            problem = lpString; // Ihr Optimierungsproblem hier
            problemType = 'LP'; // oder 'GMPL'
        }

        try {
            const allResults = await benchmarkAllSolvers(problem, problemType, bmLog);
            console.log('All benchmark results:', allResults);
            setBenchmarkResults(allResults);
        } catch (error) {
            console.error('Error running benchmark:', error);
        }
    }
    return {runBenchmark, benchmarkResults};
} export default useBenchmark;