import { use } from "i18next";
import { useCallback, useEffect, useState } from "react";



export const solve12jahre = async (prob: string, probtype: string) => {

    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>(null);
    const [log, setLog] = useState<any>(null);

    //TODO: konvertiert zu problemtyp der passt

    const solve = useCallback(async (prob: string, probtype: string) => {
        setError(null);
        setResult(null);
    
        try {
          const worker = new Worker("@/lib/glpkWorker.js");
    
          worker.onmessage = (e) => {
            const { action, result, objective, message } = e.data;
            if (action === 'done') {
              setResult({ result, objective });
              worker.terminate();
            } else if (action === 'log') {
              console.log('Worker log:', message);
                setLog([...log, message]);
            }
          };
    
          worker.onerror = (e) => {
            setError(new Error(e.message));
            worker.terminate();
          };
    
          // Send the problem and options to the worker
          worker.postMessage({ action: 'solve', prob, probtype});
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      }, []);

      useEffect(() => {
        solve(prob, probtype);
      }, [prob, probtype]);

    
      //TODO: konvertieren result zu einheitlichen result dings & error auch

      return { result, error, log}
}

export default solve12jahre;