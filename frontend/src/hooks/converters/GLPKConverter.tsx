import { LP } from "@/interfaces/glpkJavil/LP.tsx";
import {parseLP} from "@/hooks/converters/LPConverter.tsx";


export const parseGLPMAdvanced = (prob: string): Promise<LP> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Erhalte den LP-String
            const lpString = await parseGLPMAdvancedToLP(prob);

            // Parsen in LP-Objekt
            const lpObject: LP = parseLP(lpString);

            // Erfolgreich auflösen
            resolve(lpObject);
        } catch (error) {
            // Fehler abfangen und ablehnen
            reject(error);
        }
    });
};


export const parseGLPMAdvancedToLP = (prob: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('@/lib/glpkWorkerConverter.js', import.meta.url));

        // To receive information provided by the worker
        worker.onmessage = (e) => {
            const { error: workerError, lpString } = e.data;
            if (workerError) {
                console.error('Worker error:', workerError);
                worker.terminate();
                reject(new Error(workerError));
            } else {
                worker.terminate();
                resolve(lpString);
            }
        };

        // If there is an error inside the worker resolve the Promise and return the error message
        worker.onerror = (e) => {
            console.error('Worker error:', e.message);
            worker.terminate();
            reject(new Error(e.message));
        };

        // Send the problem and options to the worker
        worker.postMessage({ action: 'solve', prob });
    });
};
