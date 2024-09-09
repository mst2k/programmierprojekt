import React, { useEffect } from 'react';
import { useSolver } from './useSolver.tsx';
import { gmpl2String, gmplString } from '@/interfaces/TestData.tsx';

const GLPKSolverComponent: React.FC = () => {
  // const { solve, result, isLoading, error } = useSolver();


  // useEffect(() => {
  //   const problem = {
  //     name: 'LP',
  //     objective: {
  //         direction: 2,
  //         name: 'obj',
  //         vars: [
  //             { name: 'x1', coef: 0.6 },
  //             { name: 'x2', coef: 0.5 }
  //         ]
  //     },
  //     subjectTo: [
  //         {
  //             name: 'cons1',
  //             vars: [
  //                 { name: 'x1', coef: 1.0 },
  //                 { name: 'x2', coef: 2.0 }
  //             ],
  //             bnds: { type: 1, ub: 1.0, lb: 0.0 }
  //         },
  //         {
  //             name: 'cons2',
  //             vars: [
  //                 { name: 'x1', coef: 3.0 },
  //                 { name: 'x2', coef: 1.0 }
  //             ],
  //             bnds: { type: 3, ub: 2.0, lb: 0.0 }
  //         }
  //     ]
  // };
  // //@ts-expect-error
  //   solve(problem);
  // }, [solve]);


const lpString = `
Maximize
   obj: x1 + 2 x2 + 3 x3 + x4
Subject To
   c1: - x1 + x2 + x3 + 10 x4 <= 20
   c2: x1 - 3 x2 + x3 <= 30
   c3: x2 - 3.5 x4 = 0
Bounds
   0 <= x1 <= 40
   2 <= x4 <= 3
End
  `;



  const { result, isLoading, error } = useSolver(lpString, "LP", 'GLPK12jahre');

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