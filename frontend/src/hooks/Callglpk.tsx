import React, { useState } from 'react';

const GLPK_TEST = () => {
    const [log, setLog] = useState('');
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    let worker = null;

    const runGLPK = (mip) => {
        const problem = `
      \\* Problem: todd *\\

Maximize
obj: + 786433 x1 + 655361 x2 + 589825 x3 + 557057 x4
+ 540673 x5 + 532481 x6 + 528385 x7 + 526337 x8 + 525313 x9
+ 524801 x10 + 524545 x11 + 524417 x12 + 524353 x13
+ 524321 x14 + 524305 x15

Subject To
cap: + 786433 x1 + 655361 x2 + 589825 x3 + 557057 x4
+ 540673 x5 + 532481 x6 + 528385 x7 + 526337 x8 + 525313 x9
+ 524801 x10 + 524545 x11 + 524417 x12 + 524353 x13
+ 524321 x14 + 524305 x15 <= 4194303.5

Bounds
0 <= x1 <= 1
0 <= x2 <= 1
0 <= x3 <= 1
0 <= x4 <= 1
0 <= x5 <= 1
0 <= x6 <= 1
0 <= x7 <= 1
0 <= x8 <= 1
0 <= x9 <= 1
0 <= x10 <= 1
0 <= x11 <= 1
0 <= x12 <= 1
0 <= x13 <= 1
0 <= x14 <= 1
0 <= x15 <= 1

Generals
x1
x2
x3
x4
x5
x6
x7
x8
x9
x10
x11
x12
x13
x14
x15

End`;

        setLog('');
        setResult(null);
        setIsRunning(true);

        // In deiner React-Komponente
        const worker = new Worker(new URL('./glpkWorker.js', import.meta.url));


        worker.onmessage = (e) => {
            const obj = e.data;
            console.log("TEST")
            if (obj.action === 'log') {
                setLog((prevLog) => prevLog + obj.message + '\n');
            } else if (obj.action === 'done') {
                setResult(obj.result);
                setIsRunning(false);
                worker.terminate();
            }
        };
        // React-Komponente
        worker.onerror = (e) => {
            console.error('Worker encountered an error:', e.message);
        };

        console.log("worker posts")
        worker.postMessage({ action: 'load', data: problem, mip });
    };

    return (
        <div>
            <h1>GLPK React Example</h1>
    <textarea rows="10" cols="80" value={log} readOnly></textarea>
    <button onClick={() => runGLPK(false)} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run with MIP'}
        </button>
        <div>
        <h3>Results:</h3>
    <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
    </div>
    );
};

export default GLPK_TEST;
