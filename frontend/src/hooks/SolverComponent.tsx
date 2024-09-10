import React, { useEffect } from 'react';
import useSolver from './solvers/useSolver';

const GLPKSolverComponent: React.FC = () => {
  const { result, isLoading, error } = useSolver(`Maximize
 obj: x1 + 2 x2 + 3 x3 + x4
Subject To
 c1: - x1 + x2 + x3 + 10 x4 <= 20
 c2: x1 - 3 x2 + x3 <= 30
 c3: x2 - 3.5 x4 = 0
Bounds
 0 <= x1 <= 40
 2 <= x4 <= 3
End`, "LP", "Highs");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>GLPK Solver Result</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default GLPKSolverComponent;
