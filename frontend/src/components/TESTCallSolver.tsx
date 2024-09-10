import React from 'react';
import { useSolver } from '../hooks/solvers/useSolver.tsx';
import CodeArea from "@/components/ui/custom/CodeArea.tsx";
import { gmplStringTransp} from "@/interfaces/TestData.tsx";

const GLPKSolverComponent: React.FC = () => {
  const { result, isLoading, error, log} = useSolver(gmplStringTransp, "GMPL", 'GLPKHgourvest');

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