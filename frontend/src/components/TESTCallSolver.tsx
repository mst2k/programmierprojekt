import React from 'react';
import { useSolver } from '../hooks/solvers/useSolver.tsx';
import CodeArea from "@/components/ui/custom/CodeArea.tsx";

const GLPKSolverComponent: React.FC = () => {
  // const { solve, result, isLoading, error } = useSolver();

  const PROBLEM = `Maximize
  obj:
     x1 + 2 x2 + 4 x3 + x4
 Subject To
  c1: - x1 + x2 + x3 + 10 x4 <= 20
  c2: x1 - 4 x2 + x3 <= 30
  c3: x2 - 0.5 x4 = 0
 Bounds
  0 <= x1 <= 40
  2 <= x4 <= 3
 End`;

  const { result, isLoading, error, log} = useSolver(PROBLEM, "LP", 'Highs');

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