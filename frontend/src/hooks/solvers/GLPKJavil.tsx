import GLPK from 'glpk.js'
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {SolverResult} from "@/interfaces/Result.tsx";
import {Options} from "@/interfaces/glpkJavil/Options.tsx";
import {parseGMPL} from "@/hooks/GMPLConverter.tsx";
import {ProblemFormats} from "@/interfaces/SolverConstants.tsx";

// Singleton for GLPK instance
let glpkInstance: any = null;

export const getGLPK = async () => {
    if (!glpkInstance) {
        glpkInstance = await GLPK();
        // console.log(`FR ${glpkInstance.GLP_FR}`)
        // console.log(`LO ${glpkInstance.GLP_LO}`)
        // console.log(`UP ${glpkInstance.GLP_UP}`)
        // console.log(`DB ${glpkInstance.GLP_DB}`)
        // console.log(`FX ${glpkInstance.GLP_FX}`)
        // console.log(`MAX ${glpkInstance.GLP_MAX}`)
        // console.log(`MIN ${glpkInstance.GLP_MIN}`)
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
                    call: (progress: any) => function (progress) {log = log + progress},
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
                console.log("ERGEBNISSSS")
                console.log(JSON.stringify(LPProblem,null,2))
                console.log(JSON.stringify(res,null,2))
                console.log(await glpk.write(LPProblem))

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




// export const useSolver = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<Error | null>(null);
//     const [result, setResult] = useState<any>(null);
//
//     const solve = useCallback(async (problem: LP, solverOptions: SolverOptions = {}) => {
//         try {
//             setIsLoading(true);
//             setError(null);
//             const glpk = await getGLPK();
//
//             console.log(glpk.GLP_MAX)
//
//             const options = {
//                 msglev: glpk.GLP_MSG_ALL,
//                 presol: solverOptions.presol !== undefined ? solverOptions.presol : true,
//                 cb: solverOptions.cb || {
//                     call: (progress: any) => console.log(progress),
//                     each: 1
//                 }
//             };
//
//             const res = await glpk.solve(problem, options);
//             setResult(res);
//         } catch (err) {
//             setError(err instanceof Error ? err : new Error('An unknown error occurred'));
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);
//
//     return { solve, result, isLoading, error };
// };