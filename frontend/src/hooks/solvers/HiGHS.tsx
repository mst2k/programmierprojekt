import { SolverResult } from "@/interfaces/Result.tsx";

export const solveHiGHS = async (prob: string, probtype: string): 
    Promise<{ result: SolverResult | null; error: Error | null; log: string }> => {
    return new Promise((resolve) => {
        let result: SolverResult | null = null;
        let error: Error | null = null;
        let log: string = "";

        const worker = new Worker(new URL('@/lib/highsWorker.js', import.meta.url));

        worker.onmessage = (e) => {
            const { solution, error: workerError } = e.data;
            if (solution) {
                console.log("Raw HiGHS solution:", solution);  // Log the raw solution
                result = solution as SolverResult
                log = `Solution found. Status: ${solution.status}, Objective value: ${solution.objectiveValue}`;
            } else if (workerError) {
                error = new Error(workerError);
                log = `Error: ${workerError}`;
            }
            worker.terminate();
            resolve({ result, error, log });
        };

        worker.onerror = (e) => {
            error = new Error(e.message);
            log = `Worker error: ${e.message}`;
            worker.terminate();
            resolve({ result, error, log });
        };

        worker.postMessage({ prob, probtype });
    });
};

export default solveHiGHS;