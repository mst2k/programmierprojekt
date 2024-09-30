import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { solveHiGHS } from '@/hooks/solvers/HiGHS';
import { ProblemFormats } from '@/interfaces/SolverConstants';

describe('solveHiGHS', () => {
    // Mock the Worker
    class MockWorker {
        onmessage: ((e: MessageEvent) => void) | null = null;
        postMessage(data: any) {
            // Simulate the worker's response
            setTimeout(() => {
                if (this.onmessage) {
                    this.onmessage(new MessageEvent('message', {
                        data: {
                            solution: {
                                status: 'Optimal',
                                objectiveValue: 7.5,
                                Rows: [
                                    { Status: 'BS' },
                                    { Status: 'BS' },
                                ],
                                Columns: {
                                    x1: { Status: 'BS', Value: 2.5 },
                                    x2: { Status: 'BS', Value: 1.5 }
                                }
                            }
                        }
                    }));
                }
            }, 100);
        }
        terminate() {}
    }

    beforeAll(() => {
        // Mock the Worker constructor
        vi.stubGlobal('Worker', MockWorker);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
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

        const { result, error, log } = await solveHiGHS(lpProblem, 'LP' as ProblemFormats);

        expect(error).toBeNull();
        expect(result).not.toBeNull();
        expect(result?.status).toBe('Optimal');
        expect(result?.objectiveValue).toBeCloseTo(7.5, 5);
        expect(result?.Columns.x1.Value).toBeCloseTo(2.5, 5);
        expect(result?.Columns.x2.Value).toBeCloseTo(1.5, 5);
        expect(log).toContain('Solution found');
    });

    it('should handle errors', async () => {
        class ErrorWorker extends MockWorker {
            postMessage() {
                setTimeout(() => {
                    if (this.onmessage) {
                        this.onmessage(new MessageEvent('message', {
                            data: { error: 'Test error' }
                        }));
                    }
                }, 100);
            }
        }

        vi.stubGlobal('Worker', ErrorWorker);

        const { result, error, log } = await solveHiGHS('invalid problem', 'LP' as ProblemFormats);

        expect(result).toBeNull();
        expect(error).not.toBeNull();
        expect(error?.message).toBe('Test error');
        expect(log).toContain('Error: Test error');
    });

    it('should convert GMPL to LP', async () => {
        vi.mock('@/hooks/converters/GLPKConverter', () => ({
            parseGLPMAdvancedToLP: vi.fn().mockResolvedValue('Converted LP')
        }));

        const gmplProblem = 'GMPL problem';

        await solveHiGHS(gmplProblem, 'GMPL' as ProblemFormats);

        const { parseGLPMAdvancedToLP } = await import('@/hooks/converters/GLPKConverter');
        expect(parseGLPMAdvancedToLP).toHaveBeenCalledWith(gmplProblem);
    });

    it('should convert MPS to LP', async () => {
        vi.mock('@/hooks/converters/MPSConverter', () => ({
            parseMPS: vi.fn().mockReturnValue({})
        }));
        vi.mock('@/hooks/converters/LPConverter', () => ({
            convertToLP: vi.fn().mockReturnValue('Converted LP')
        }));

        const mpsProblem = 'MPS problem';

        await solveHiGHS(mpsProblem, 'MPS' as ProblemFormats);

        const { parseMPS } = await import('@/hooks/converters/MPSConverter');
        const { convertToLP } = await import('@/hooks/converters/LPConverter');
        expect(parseMPS).toHaveBeenCalledWith(mpsProblem);
        expect(convertToLP).toHaveBeenCalled();
    });
});