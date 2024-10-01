import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseGLPMAdvanced, parseGLPMAdvancedToLP } from '@/hooks/converters/GLPKConverter';
import * as LPConverter from '@/hooks/converters/LPConverter';

describe('GLPM Parsing Functions', () => {
    // Mock the Worker
    class MockWorker {
        onmessage: ((e: MessageEvent) => void) | null = null;
        onerror: ((e: ErrorEvent) => void) | null = null;
        postMessage(data: any) {
            setTimeout(() => {
                if (this.onmessage) {
                    this.onmessage(new MessageEvent('message', {
                        data: {
                            lpString: 'Maximize\n  obj: x1 + 2 x2\nSubject To\n  c1: x1 + x2 <= 10\nBounds\n  0 <= x1 <= 5\n  0 <= x2'
                        }
                    }));
                }
            }, 100);
        }
        terminate() {}
    }

    beforeEach(() => {
        // Mock the Worker constructor
        vi.stubGlobal('Worker', MockWorker);

        // Mock console methods
        vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock LPConverter
        vi.mock('@/hooks/converters/LPConverter', () => ({
            parseLP: vi.fn().mockReturnValue({
                name: 'Test Problem',
                objective: { direction: 1, name: 'obj', vars: [{ name: 'x1', coef: 1 }, { name: 'x2', coef: 2 }] },
                subjectTo: [
                    { name: 'c1', vars: [{ name: 'x1', coef: 1 }, { name: 'x2', coef: 1 }], bnds: { type: 1, ub: 10, lb: -Infinity } }
                ],
                bounds: [
                    { name: 'x1', type: 2, ub: 5, lb: 0 },
                    { name: 'x2', type: 2, ub: Infinity, lb: 0 }
                ]
            })
        }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('should parse GLPM to LP string', async () => {
        const glpmProblem = 'var x1, x2; maximize obj: x1 + 2*x2; s.t. c1: x1 + x2 <= 10; bounds: 0 <= x1 <= 5, x2 >= 0;';

        const result = await parseGLPMAdvancedToLP(glpmProblem);

        expect(result).toBe('Maximize\n  obj: x1 + 2 x2\nSubject To\n  c1: x1 + x2 <= 10\nBounds\n  0 <= x1 <= 5\n  0 <= x2');
    });

    it('should parse GLPM to LP object', async () => {
        const glpmProblem = 'var x1, x2; maximize obj: x1 + 2*x2; s.t. c1: x1 + x2 <= 10; bounds: 0 <= x1 <= 5, x2 >= 0;';

        const result = await parseGLPMAdvanced(glpmProblem);

        expect(result).toEqual({
            name: 'Test Problem',
            objective: { direction: 1, name: 'obj', vars: [{ name: 'x1', coef: 1 }, { name: 'x2', coef: 2 }] },
            subjectTo: [
                { name: 'c1', vars: [{ name: 'x1', coef: 1 }, { name: 'x2', coef: 1 }], bnds: { type: 1, ub: 10, lb: -Infinity } }
            ],
            bounds: [
                { name: 'x1', type: 2, ub: 5, lb: 0 },
                { name: 'x2', type: 2, ub: Infinity, lb: 0 }
            ]
        });

        expect(LPConverter.parseLP).toHaveBeenCalledWith('Maximize\n  obj: x1 + 2 x2\nSubject To\n  c1: x1 + x2 <= 10\nBounds\n  0 <= x1 <= 5\n  0 <= x2');
    });

    it('should handle worker errors in parseGLPMAdvancedToLP', async () => {
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

        await expect(parseGLPMAdvancedToLP('invalid problem')).rejects.toThrow('Worker error');
        expect(console.error).toHaveBeenCalledWith('Worker error:', 'Worker error');
    });

    it('should handle errors in parseGLPMAdvanced', async () => {
        vi.mocked(LPConverter.parseLP).mockImplementationOnce(() => {
            throw new Error('Parsing error');
        });

        await expect(parseGLPMAdvanced('invalid problem')).rejects.toThrow('Parsing error');
    });
});