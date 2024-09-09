import { useState, useCallback, useEffect } from 'react';
import solve12jahre from './solvers/GLPK12jahre';

export const useSolver = (initialProb: any, initialProbType: any, initialSolver: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const solve = useCallback(async (prob: any, probtype: any, solver: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      switch (solver) {
        case "GLPK12jahre":
          const { result: solveResult, error: solveError, log } = await solve12jahre(prob, probtype);
          console.log("RESULT: ", solveResult);
          if (solveResult) {
            setResult(solveResult);
          }
          if (solveError) {
            setError(solveError);
          }
          // Optionally, do something with the log
          break;
        // Add other solvers here
        default:
          throw new Error(`Unsupported solver: ${solver}`);
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    solve(initialProb, initialProbType, initialSolver);
  }, [initialProb, initialProbType, initialSolver, solve]);

  return { result, isLoading, error, solve };
};

export default useSolver;