import { useCallback, useEffect, useState } from "react";

export const solve12jahre = async (prob: string, probtype: string): Promise<{ result: any; error: Error | null; log: string[] }> => {
    return new Promise((resolve) => {
        let result: any = null;
        let error: Error | null = null;
        let log: string[] = [];

        const worker = new Worker(new URL('../../lib/glpkWorker.js', import.meta.url));

        worker.onmessage = (e) => {
            const { action, result: workerResult, objective, message } = e.data;
            if (action === 'done') {
                console.log({ result: workerResult, objective });
                result = { result: workerResult, objective };
                worker.terminate();
                resolve({ result, error, log });
            } else if (action === 'log') {
                console.log('Worker log:', message);
                log.push(message);
            }
        };

        worker.onerror = (e) => {
            error = new Error(e.message);
            console.log('Worker error:', e.message);
            worker.terminate();
            resolve({ result, error, log });
        };

        // Send the problem and options to the worker
        worker.postMessage({ action: 'solve', prob, probtype });
    });
};

export default solve12jahre;