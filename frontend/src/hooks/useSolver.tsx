import { useState, useCallback } from 'react';
import GLPK from 'glpk.js';

// Singleton for GLPK instance
let glpkInstance: any = null;

export const getGLPK = async () => {
  if (!glpkInstance) {
    glpkInstance = await GLPK();
  }
  return glpkInstance;
};

interface Problem {
  name: string;
  objective: {
    direction: string;
    name: string;
    vars: { name: string; coef: number }[];
  };
  subjectTo: {
    name: string;
    vars: { name: string; coef: number }[];
    bnds: { type: string; ub: number; lb: number };
  }[];
}

interface SolverOptions {
  msglev?: string;
  presol?: boolean;
  cb?: {
    call: (progress: any) => void;
    each: number;
  };
}

export const useSolver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const solve = useCallback(async (problem: Problem, solverOptions: SolverOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const glpk = await getGLPK();
      
        console.log(glpk.GLP_MAX)

      const options = {
        msglev: solverOptions.msglev || glpk.GLP_MSG_ALL,
        presol: solverOptions.presol !== undefined ? solverOptions.presol : true,
        cb: solverOptions.cb || {
          call: (progress: any) => console.log(progress),
          each: 1
        }
      };

      const res = await glpk.solve(problem, options);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { solve, result, isLoading, error };
};