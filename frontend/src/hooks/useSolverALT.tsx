import React, { useEffect } from 'react';
import { getGLPK, useSolver } from './useSolver';

const GLPKSolverComponent: React.FC = () => {
  const { solve, result, isLoading, error } = useSolver();


  useEffect(() => {
    const problem = {
      name: 'LP',
      objective: {
          direction: 2,
          name: 'obj',
          vars: [
              { name: 'x1', coef: 0.6 },
              { name: 'x2', coef: 0.5 }
          ]
      },
      subjectTo: [
          {
              name: 'cons1',
              vars: [
                  { name: 'x1', coef: 1.0 },
                  { name: 'x2', coef: 2.0 }
              ],
              bnds: { type: 1, ub: 1.0, lb: 0.0 }
          },
          {
              name: 'cons2',
              vars: [
                  { name: 'x1', coef: 3.0 },
                  { name: 'x2', coef: 1.0 }
              ],
              bnds: { type: 3, ub: 2.0, lb: 0.0 }
          }
      ]
  };
    solve(problem);
  }, [solve]);

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