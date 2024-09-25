import {ColumnData, RowData, SolverResult} from "@/interfaces/Result.tsx";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";
import {parseGLPMAdvancedToLP} from "@/hooks/converters/GLPKConverter.tsx";
import {parseMPS} from "@/hooks/converters/MPSConverter.tsx";
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {convertToLP} from "@/hooks/converters/LPConverter.tsx";

/**
 * Solves a linear programming problem using the HiGHS solver.
 * @async
 * @param {string} prob - The problem description string.
 * @param {ProblemFormats} probtype - The format of the problem (e.g., "GMPL", "LP", "MPS").
 * @returns {Promise<{result: SolverResult | null, error: Error | null, log: string}>} A promise that resolves to an object containing the solver result, any error, and a log string.
 */
export const solveHiGHS = async (prob: string, probtype: ProblemFormats):
    Promise<{ result: SolverResult | null; error: Error | null; log: string }> => {
    function adjustResult(result: SolverResult) {
        const statusMappingVariable: { [key: string]: RowData["Status"] | ColumnData["Status"] } = {
            "BS": 'Basic',
            "LB": 'Lower Bound',
            "UB": 'Upper Bound',
            "FR": 'Free',
            "FX": 'Fixed'
        };

        // Iteriere durch die Zeilen des Ergebnisses
        for (const row of result.Rows) {
            row.Status = statusMappingVariable[row.Status] || row.Status;
        }

        // Iteriere durch die Spalten des Ergebnisses
        for (const columnKey in result.Columns) {
            let column = result.Columns[columnKey];
            column.Status = statusMappingVariable[column.Status] || column.Status;
        }

        return result;
    }


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
                result = adjustResult(result)
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
        try {
            switch (probtype) {
                case "GMPL":
                    prob = await parseGLPMAdvancedToLP(prob)
                    probtype = "LP"
                    break;
                case "MPS":
                    const lpObject: LP = parseMPS(prob);
                    prob = convertToLP(lpObject)
                    probtype = "LP"
                    break
            }
        }catch (er){
            error = er as Error
            resolve({result, error, log});
        }
        worker.postMessage({prob, probtype});
    }) as Promise<{ result: SolverResult | null; error: Error | null; log: string }>;
};

export default solveHiGHS;