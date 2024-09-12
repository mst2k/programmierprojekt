import React from 'react';
import { useSolver } from '../../../hooks/solvers/useSolver.tsx';
import CodeArea from "@/components/ui/custom/CodeArea.tsx";
import {gmplString} from "@/interfaces/TestData.tsx";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";

const GLPKSolverComponent: React.FC = (data) => {
  const {lpProblem, problemType, lpSolver} = data
  const { result, isLoading, error, log} = useSolver(lpProblem, problemType, lpSolver);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>GLPK Solver Result</h1>
        <div className={"width-100"}>
        <CodeArea data={JSON.stringify(result, null, 2)}></CodeArea>
          {log && <CodeArea data={log}></CodeArea>}
        </div>
    </div>
  );
};

export default GLPKSolverComponent;