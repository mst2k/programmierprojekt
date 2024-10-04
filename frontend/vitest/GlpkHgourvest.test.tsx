import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { solveGLPKHgourvest } from '@/hooks/solvers/GLPKHgourvest';
import { ProblemFormats } from '@/interfaces/SolverConstants';
import * as MPSConverter from '@/hooks/converters/MPSConverter';
import * as GMPLConverter from '@/hooks/converters/GMPLConverter';

describe('solveGLPKHgourvest', () => {
    // Mock the Worker
    class MockWorker {
        onmessage: ((e: MessageEvent) => void) | null = null;
        onerror: ((e: ErrorEvent) => void) | null = null;
        postMessage(data: any) {
            setTimeout(() => {
                if (this.onmessage) {
                    if (data.probtype === 'LP') {
                        this.onmessage(new MessageEvent('message', {
                            data: {
                                action: 'done',
                                result: {
                                    status: 'Optimal',
                                    objectiveValue: 7.5,
                                    Columns: {
                                        x1: { Value: 2.5 },
                                        x2: { Value: 1.5 }
                                    }
                                },
                                objective: 7.5,
                                output: 'Solution found'
                            }
                        }));
                    } else {
                        this.onmessage(new MessageEvent('message', {
                            data: {
                                action: 'log',
                                message: 'Processing problem'
                            }
                        }));
                        this.onmessage(new MessageEvent('message', {
                            data: {
                                action: 'done',
                                result: {
                                    status: 'Optimal',
                                    objectiveValue: 10,
                                    Columns: {
                                        x1: { Value: 3 },
                                        x2: { Value: 2 }
                                    }
                                },
                                objective: 10,
                                output: 'Solution found for GMPL problem'
                            }
                        }));
                    }
                }
            }, 100);
        }
        terminate() {}
    }

    beforeEach(() => {
        // Mock the Worker constructor
        vi.stubGlobal('Worker', MockWorker);

        // Mock console methods
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('should solve an LP problem', async () => {
        const lpProblem = `
      Maximize
        z: 3x1 + 2x2
      Subject To
        c1: x1 + x2 <= 4
        c2: 2x1 + x2 <= 7
      Bounds
        x1 >= 0
        x2 >= 0
    `;

        const { result, error, log } = await solveGLPKHgourvest(lpProblem, 'LP' as ProblemFormats);

        expect(error).toBeNull();
        expect(result).not.toBeNull();
        expect(result?.status).toBe('Optimal');
        expect(result?.objectiveValue).toBeCloseTo(7.5, 5);
        expect(result?.Columns.x1.Value).toBeCloseTo(2.5, 5);
        expect(result?.Columns.x2.Value).toBeCloseTo(1.5, 5);
        expect(result?.Output).toBe('Solution found');
        expect(log).toBe('');
    });

    it('should solve a GMPL problem', async () => {
        const gmplProblem = 'var x1; var x2; maximize obj: 3*x1 + 2*x2;';

        const { result, error, log } = await solveGLPKHgourvest(gmplProblem, 'GMPL' as ProblemFormats);

        expect(error).toBeNull();
        expect(result).not.toBeNull();
        expect(result?.status).toBe('Optimal');
        expect(result?.objectiveValue).toBeCloseTo(10, 5);
        expect(result?.Columns.x1.Value).toBeCloseTo(3, 5);
        expect(result?.Columns.x2.Value).toBeCloseTo(2, 5);
        expect(result?.Output).toBe('Solution found for GMPL problem');
        expect(log).toContain('Processing problem');
    });

    it('should handle MPS format by converting to GMPL', async () => {
        vi.mock('@/hooks/converters/MPSConverter', () => ({
            parseMPS: vi.fn().mockReturnValue({ /* mock LP object */ }),
        }));
        vi.mock('@/hooks/converters/GMPLConverter', () => ({
            convertToGMPL: vi.fn().mockReturnValue('Converted GMPL Problem'),
        }));

        const mpsProblem = 'MPS FORMAT PROBLEM';

        await solveGLPKHgourvest(mpsProblem, 'MPS' as ProblemFormats);

        expect(MPSConverter.parseMPS).toHaveBeenCalledWith(mpsProblem);
        expect(GMPLConverter.convertToGMPL).toHaveBeenCalled();
    });

    it('should handle worker errors', async () => {
        class ErrorWorker extends MockWorker {
            postMessage() {
                setTimeout(() => {
                    if (this.onerror) {
                        this.onerror(new ErrorEvent('error', { message: 'Worker error' }));
                    }
                }, 100);
            }
        }

        vi.stubGlobal('Worker', ErrorWorker);

        const { result, error, log } = await solveGLPKHgourvest('problem', 'LP' as ProblemFormats);

        expect(result).toBeNull();
        expect(error).not.toBeNull();
        expect(error?.message).toBe('Worker error');
        expect(log).toBe('');
        expect(console.error).toHaveBeenCalledWith('Worker error:', 'Worker error');
    });
});