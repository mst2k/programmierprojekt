import React from 'react';
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import useSolver from "@/hooks/solvers/useSolver.tsx";
import CodeArea from "@/components/ui/custom/CodeArea.tsx";

// Definiere das Interface für die Props
interface GLPKSolverProps {
  lpProblem: string;
  problemType: ProblemFormats;  // Definiere den Typ 'ProblemFormats'
  lpSolver: Solvers;            // Definiere den Typ 'Solvers'
}

const GLPKSolverComponent: React.FC<GLPKSolverProps> = ({ lpProblem, problemType, lpSolver }) => {
  // Verwende den useSolver Hook, um das Solver-Ergebnis zu erhalten
  const { result, isLoading, error, log } = useSolver(lpProblem, problemType, lpSolver);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
      <div>
        <h1>GLPK Solver Result</h1>
        <div className="width-100">
          <CodeArea data={JSON.stringify(result, null, 2)}></CodeArea>
          {log && <CodeArea data={log}></CodeArea>}
        </div>
      </div>
  );
};

export default GLPKSolverComponent;
