import { useState, useCallback, useEffect } from 'react';
import solveGLPKHgourvest from './GLPKHgourvest .tsx';
import { SolverResult } from "@/interfaces/Result.tsx";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";

/**
 * Custom Hook to handle solving problems using different solvers.
 *
 * @param initialProb - The initial problem definition to solve.
 * @param initialProbType - The type of the problem (e.g., LP, MIP).
 * @param initialSolver - The solver to use (e.g., "GLPKJavil").
 *
 * @returns {{
 *   result: SolverResult | null;
 *   isLoading: boolean;
 *   log: string | null;
 *   solve: (prob: any, probtype: any, solver: any) => Promise<void>;
 *   error: Error | null;
 * }} - The state of the solver, including the result, loading status, error, and the function to trigger solving of
 * another problem.
 */
export const useSolver = (
    initialProb: string,
    initialProbType: ProblemFormats,
    initialSolver: Solvers
): {
  result: SolverResult | null;
  isLoading: boolean;
  log: string | null;
  solve: (prob: any, ProblemFormats: any, solver: Solvers) => Promise<void>;
  error: Error | null;
} => {
  // State to track whether the solver is currently running
  const [isLoading, setIsLoading] = useState(false);

  // State to track any error that occurs during solving
  const [error, setError] = useState<Error | null>(null);

  // State to hold the result of the solver
  const [result, setResult] = useState<SolverResult | null>(null);

  // State to capture the log output from the solver
  const [log, setLog] = useState<string>("");

  /**
   * Function to execute the solver with the provided problem, type, and solver type.
   *
   * @param {string} prob - The problem definition to be solved (in the given propFormat).
   * @param {ProblemFormats} probtype - The type of the problem (e.g., LP, GMPL).
   * @param {any} solver - The name of the solver to use.
   * @returns {Promise<void>} - Resolves when the solving process is complete.
   */
  const solve = useCallback(async (prob: string, probtype: ProblemFormats, solver: Solvers) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLog("");

    try {
      switch (solver) {
        case "GLPKHgourvest":
          const { result: solveResult, error: solveError, log } = await solveGLPKHgourvest(prob, probtype);
          if (solveResult) {
            setResult(solveResult);
          }
          if (solveError) {
            setError(solveError);
          }
          setLog(log);
          break;
          // Additional solvers can be added here
        default:
          setError(Error(`Unsupported solver: ${solver}`));
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically solve the problem when the initial problem or solver changes
  useEffect(() => {
    solve(initialProb, initialProbType, initialSolver);
  }, [initialProb, initialProbType, initialSolver, solve]);

  return { result, isLoading, error, solve, log };
};

export default useSolver;
