import GLPK from 'glpk.js'
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {ColumnData, RowData, SolverResult} from "@/interfaces/Result.tsx";
import {Options} from "@/interfaces/glpkJavil/Options.tsx";
import {parseGMPL} from "@/hooks/GMPLConverter.tsx";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";
import {Result} from "@/interfaces/glpkJavil/Result.tsx";

// Singleton for GLPK instance
let glpkInstance: any = null;

export const getGLPK = async () => {
    if (!glpkInstance) {
        glpkInstance = await GLPK();
    }
    return glpkInstance;
};


export const solveGLPKJavil = async (prob: string, probtype: ProblemFormats): Promise<{ result: SolverResult | null; error: Error | null; log: string}> => {
    return new Promise(async (resolve) => {
        let result: SolverResult | null = null;
        let error: Error | null = null;
        let log: string = "";

        try {
            const glpk = await getGLPK();  // Hier wird gewartet, bis GLPK vollständig geladen ist

            const options: Options = {
                msglev: glpk.GLP_MSG_ERR,  // Jetzt ist GLP_MSG_ALL verfügbar
                presol: true,
                cb: {
                    call: (progress: any) => console.log(progress),
                    each: 1
                }
            } as Options;

            //Convert problem to glpk Interface
            let LPProblem: LP | undefined = undefined;
            switch (probtype) {
                case "GMPL":
                    LPProblem = parseGMPL(prob);
                    break;
                default:
                    error = Error("Unsupported problem type");
            }
            if(LPProblem){
                const res = await glpk.solve(LPProblem, options);
                console.log(JSON.stringify(res, null, 2))
                result = transformSolverResult(LPProblem, res)
            }else {
                error = Error("No problem provided for solving. Probably the conversion was not successful");
            }
            resolve({ result, error, log });
        } catch (err){
            error = err as Error;
            resolve({ result, error, log });
        }
    });
};


function transformSolverResult(lp: LP, result: Result): SolverResult {
    // Mapping der Status-Codes des Solvers auf die Status-Codes in SolverResult
    const statusMap: { [key: number]: SolverResult['Status'] } = {
        0: 'Optimal',
        1: 'Infeasible',
        2: 'Unbounded',
        3: 'Error',
        4: 'Unknown',
    };

    // Erstelle Columns aus Variablen und Bounds
    const columns: { [key: string]: ColumnData } = {};

    // Falls es Schranken (bounds) gibt, iteriere darüber und sammle Infos
    if (lp.bounds) {
        lp.bounds.forEach(bound => {
            const variableName = bound.name;
            columns[variableName] = {
                Index: Object.keys(columns).length, // Index basierend auf der Reihenfolge
                Status: getVariableStatus(result.result.vars[variableName], bound),
                Lower: bound.lb,
                Upper: bound.ub,
                Type: getVariableType(variableName, lp), // Continuous, Integer, Binary
                Primal: result.result.vars[variableName] || 0, // Wert aus dem Resultat
                Dual: result.result.dual?.[variableName] || 0, // Dualwert, falls vorhanden
                Name: variableName,
            };
        });
    }

    // Erstelle Rows aus den Constraints (subjectTo) und ggf. Dualwerten
    const rows: RowData[] = lp.subjectTo.map((constraint, index) => {
        return {
            Index: index,
            Name: constraint.name,
            Status: "Basic",
            Lower: constraint.bnds.lb,
            Upper: constraint.bnds.ub,
            Primal: calculatePrimal(constraint, result.result.vars), // Berechne den Primalwert
            Dual: result.result.dual?.[constraint.name] || 0, // Dualwert, falls vorhanden
        };
    });

    return {
        Status: statusMap[result.result.status] || 'Unknown',
        ObjectiveValue: result.result.z,
        Columns: columns,
        Rows: rows,
        Output: `Solution for ${lp.name} computed in ${result.time} seconds`,
    };
}

function getVariableStatus(primalValue: number, bound: { type: number, lb: number, ub: number }): ColumnData['Status'] {
    if (primalValue === bound.lb) return 'Lower Bound';
    if (primalValue === bound.ub) return 'Upper Bound';
    if (bound.lb === -Infinity && bound.ub === Infinity) return 'Free';
    return 'Basic';
}

function getVariableType(variableName: string, lp: LP): ColumnData['Type'] {
    if (lp.binaries && lp.binaries.includes(variableName)) return 'Binary';
    if (lp.generals && lp.generals.includes(variableName)) return 'Integer';
    return 'Continuous';
}


function calculatePrimal(constraint: LP['subjectTo'][number], vars: { [key: string]: number }): number {
    // Berechne den Primalwert für die Nebenbedingung (Summe der Variablenkoeffizienten * Variablenwert)
    return constraint.vars.reduce((sum, variable) => {
        return sum + (variable.coef * (vars[variable.name] || 0));
    }, 0);
}



