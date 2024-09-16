import { SolverResult } from "@/interfaces/Result.tsx";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";
import {parseGLPMAdvancedToLP} from "@/hooks/converters/GLPKConverter.tsx";
import {parseMPS} from "@/hooks/converters/MPSConverter.tsx";
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {convertToLP} from "@/hooks/converters/LPConverter.tsx";

export const solveHiGHS = async (prob: string, probtype: ProblemFormats):
    Promise<{ result: SolverResult | null; error: Error | null; log: string }> => {
    return new Promise(async (resolve) => {
        let result: SolverResult | null = null;
        let error: Error | null = null;
        let log: string = "";

        const worker = new Worker(new URL('@/lib/highsWorker.js', import.meta.url));

        worker.onmessage = (e) => {
            const {solution, error: workerError} = e.data;
            if (solution) {
                console.log("Raw HiGHS solution:", solution);  // Log the raw solution
                result = solution as SolverResult
                log = `Solution found. Status: ${solution.status}, Objective value: ${solution.objectiveValue}`;
            } else if (workerError) {
                error = new Error(workerError);
                log = `Error: ${workerError}`;
            }
            worker.terminate();
            resolve({result, error, log});
        };

        worker.onerror = (e) => {
            error = new Error(e.message);
            log = `Worker error: ${e.message}`;
            worker.terminate();
            resolve({result, error, log});
        };

        //Worker can only handle LP Format. Converting
        switch (probtype){
            case "GMPL":
                prob = await parseGLPMAdvancedToLP(prob)
                probtype = "LP"
                break;
            case "MPS":
                const lpObject:LP = parseMPS(prob);
                prob = convertToLP(lpObject)
                probtype="LP"
                break
        }
        worker.postMessage({prob, probtype});
    }) as Promise<{ result: SolverResult | null; error: Error | null; log: string }>;
};

export default solveHiGHS;