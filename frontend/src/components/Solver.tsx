import { useGLPK } from '@/hooks/useSolver';
import React, { useState } from 'react';


export const GLPKSolver: React.FC = () => {

  const [problemString, setProblemString] = useState('');

  const result = useGLPK(problemString);

  return (
    <div>
      <textarea
        value={problemString}
        onChange={(e) => setProblemString(e.target.value)}
        placeholder="Enter your GLPK problem here"
        rows={10}
        cols={50}
      />
           <div>
           <h2>Lösung:</h2>
           <pre>{JSON.stringify(result, null, 2)}</pre>
         </div>
    </div>
  );
};