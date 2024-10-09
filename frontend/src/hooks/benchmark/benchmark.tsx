import { lpString } from "@/interfaces/TestData.tsx";
import { useState } from "react";
import { ProblemFormats } from "@/interfaces/SolverConstants.tsx";
import solveGLPKHgourvest from "@/hooks/solvers/GLPKHgourvest.tsx";
import {solveGLPKJavil} from "@/hooks/solvers/GLPKJavil.tsx";
import solveHiGHS from "@/hooks/solvers/HiGHS.tsx";

function useBenchmark() {
    const [benchmarkResults, setBenchmarkResults] = useState<any>(null);

    async function benchmarkAllSolvers(problem: string, problemType: ProblemFormats, bmLog: (arg: string) => void) {
        const browserSolvers = ['glpkHgourvest', 'highs'];
        const results: { [key: string]: any } = {};

        // Browser Solvers
        for (const solver of browserSolvers) {
            console.log(`Running solver in browser: ${solver}`);
            bmLog(`Running solver in browser: ${solver}`);
            let solveResult = null;
            const start = performance.now();

            try {
                switch (solver) {
                    case 'glpkHgourvest':
                        solveResult = await solveGLPKHgourvest(problem, problemType);
                        break;
                    case 'glpkJavil':
                        solveResult = await solveGLPKJavil(problem, problemType);
                        break;
                    case 'highs':
                        solveResult = await solveHiGHS(problem, problemType);
                        break;
                }

                const end = performance.now();
                const executionTime = (end - start) / 1000; // Umrechnung in Sekunden
                results[solver] = {
                    executionTime,
                    durationSolving: solveResult?.result?.DurationSolving, // Direktes Abrufen des Ergebnisses
                };
            } catch (error) {
                console.error(`Error in browser solver ${solver}:`, error);
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
            results["glpk(Backend)"] = {
                executionTime: data["glpk"]["execution_time"],
                durationSolving: data["glpk"]["solution_time"]
            };
            results["highs(Backend)"] = {
                executionTime: data["highs"]["execution_time"],
                durationSolving: data["highs"]["solution_time"]
            };
        } catch (error) {
            console.error(`Error in API solver:`, error);
        }

        return results;
    }

    async function runBenchmark(problem?: string, problemType?: ProblemFormats, bmLog?: (arg: string) => void) {
        if (problemType === undefined || problem === undefined) {
            problem = lpString; // Ihr Optimierungsproblem hier
            problemType = 'LP' as ProblemFormats; // oder 'GMPL'
        }
        if (!bmLog) {
            bmLog = (log: string) => { console.log(log); };
        }

        try {
            const allResults = await benchmarkAllSolvers(problem, problemType, bmLog);
            console.log('All benchmark results:', allResults);
            setBenchmarkResults(allResults);
        } catch (error) {
            console.error('Error running benchmark:', error);
        }
    }

    return { runBenchmark, benchmarkResults };
}

export default useBenchmark;
