import { useState, useCallback, useEffect } from 'react';
import GLPK from 'glpk.js';
// import {LP} from "@/interfaces/glpkJavil/LP.tsx";
// import {Options} from "@/interfaces/glpkJavil/Options.tsx";
import solve12jahre from './solvers/GLPK12jahre';
// import { set } from 'react-hook-form';

// Singleton for GLPK instance
let glpkInstance: any = null;

export const getGLPK = async () => {
  if (!glpkInstance) {
    glpkInstance = await GLPK();
  }
  return glpkInstance;
};


export const useSolver = async (prob: any, probtype: any, solver: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  //switch solver 
  // GLPM:
      //{result, error, log} = await solve12jahre(prob, probtype)

      switch (solver) {
        case "GLPK12jahre":
          try {
            const { result, error, log } = await solve12jahre(prob, probtype);
            console.log("RESULT: ", result);
            if (result) {
              setResult(result);
            }
            if (error) {
              setError(error);
            }
            // Optionally, do something with the log
          } catch (err) {
            console.error("An error occurred:", err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          }
          break;
  // const solve = useCallback(async (problem: LP, solverOptions: Options = {}) => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     const glpk = await getGLPK();
      
  //       console.log(glpk.GLP_MAX)

  //     const options = {
  //       msglev: solverOptions.msglev || glpk.GLP_MSG_ALL,
  //       presol: solverOptions.presol !== undefined ? solverOptions.presol : true,
  //       cb: solverOptions.cb || {
  //         call: (progress: any) => console.log(progress),
  //         each: 1
  //       }
  //     };

  //     const res = await glpk.solve(problem, options);
  //     setResult(res);
  //   } catch (err) {
  //     setError(err instanceof Error ? err : new Error('An unknown error occurred'));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  setIsLoading(false);

  useEffect(() => {
    console.log("RESULTAT: ",result)
  }, [result])

  return { result, isLoading, error };
};
}

/*

import { useState, useCallback } from 'react';

// Define supported problem types
export type ProblemType = 'LP' | 'GMPL' | 'MPS';

export const useSolver = (solverUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const solve = useCallback(async (problem: string, problemType: ProblemType, solverOptions: any = {}) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const worker = new Worker(solverUrl);

      worker.onmessage = (e) => {
        const { action, result, objective, message } = e.data;
        if (action === 'done') {
          setResult({ result, objective });
          setIsLoading(false);
          worker.terminate();
        } else if (action === 'log') {
          console.log('Worker log:', message);
        }
      };

      worker.onerror = (e) => {
        setError(new Error(e.message));
        setIsLoading(false);
        worker.terminate();
      };

      // Send the problem and options to the worker
      worker.postMessage({ action: 'solve', problem, problemType, solverOptions });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  }, [solverUrl]);

  return { solve, result, isLoading, error };
};

*/
