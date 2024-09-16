import {SolverResult} from "@/interfaces/Result.tsx";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";
import {parseMPS} from "@/hooks/converters/MPSConverter.tsx";
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {convertToGLPM} from "@/hooks/converters/GMPLConverter.tsx";


/**
 * Solves a given problem using the GLPK solver by Hgovrvest and handles communication with a web worker.
 * The Solver is quiet old and can't be used without a worker
 *
 * @param {string} prob - The problem definition in string format.
 * @param {string} probtype - The type of the problem (e.g., LP, GMPL).
 * @returns {Promise<{ result: SolverResult; error: Error | null; log: string }>}
 * - A Promise that resolves to an object containing the solver result, error (if any), and the log.
 *
 * The object includes:
 * - `result`: The result of the solver (of type `SolverResult`).
 * - `error`: An error object if the solver encounters any issue, otherwise null.
 * - `log`: The log or output message from the solver.
 *
 * The function communicates with a web worker to execute the solver in the background.
 * The worker sends messages for logging (`log`) and final results (`done`).
 * In case of an error, the worker is terminated and an error message is returned.
 */

export const solveGLPKHgourvest = async (prob: string, probtype: ProblemFormats):
    Promise<{ result: SolverResult | null; error: Error | null; log: string}> => {
    return new Promise((resolve) => {

        let result: SolverResult | null = null;
        let error: Error | null = null;
        let log: string = "";
        const worker = new Worker(new URL('@/lib/glpkWorker.js', import.meta.url));

        //To receive information provided by the worker
        worker.onmessage = (e) => {
            const { action, result: workerResult, objective, message, error: workerError , output} = e.data;
            if (action === 'done') {
                if (workerError) {
                    error = new Error(workerError);
                    console.error('Worker error:', workerError);
                } else {
                    console.log({ result: workerResult, objective, output });
                    workerResult.Output = output
                    result = workerResult as SolverResult | null;
                }
                worker.terminate();
                resolve({ result, error, log});
            } else if (action === 'log') {
                console.log('Worker log:', message);
                log = `${log}\n ${message}`;
            }
        };

        //If there is a error inside the worker resolve the Promise and return the error message
        worker.onerror = (e) => {
            error = new Error(e.message);
            console.error('Worker error:', e.message);
            worker.terminate();
            resolve({ result, error, log });
        };

        //worker can only handle LP an GMPL => Parse MPS bevorehand!
        if(probtype === "MPS"){
            const lpProblem:LP = parseMPS(prob);
            prob = convertToGLPM(lpProblem);
            probtype = "GMPL";

        }
        // Send the problem and options to the worker
        worker.postMessage({ action: 'solve', prob, probtype });
    }) as Promise<{ result: SolverResult | null; error: Error | null; log: string }>;
};

export default solveGLPKHgourvest;