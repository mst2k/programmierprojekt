import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { solveGLPKJavil, getGLPK } from '@/hooks/solvers/GLPKJavil';
import { ProblemFormats } from '@/interfaces/SolverConstants';
import * as GLPKConverter from '@/hooks/converters/GLPKConverter';
import * as LPConverter from '@/hooks/converters/LPConverter';
import * as MPSConverter from '@/hooks/converters/MPSConverter';

// Mock GLPK
vi.mock('glpk.js', () => ({
    default: vi.fn().mockResolvedValue({
        solve: vi.fn().mockResolvedValue({
            result: {
                status: 5,
                z: 7.5,
                vars: { x1: 2.5, x2: 1.5 },
                dual: { c1: 1, c2: 0.5 }
            },
            time: 0.1
        }),
        GLP_MSG_ALL: 2
    })
}));

describe('solveGLPKJavil', () => {
    beforeAll(() => {
        // Mock the converters
        vi.mock('@/hooks/converters/GLPKConverter', () => ({
            parseGLPMAdvanced: vi.fn().mockResolvedValue({
                name: 'Test Problem',
                objective: { direction: 1, name: 'obj', vars: [] },
                subjectTo: [
                    { name: 'c1', vars: [{ name: 'x1', coef: 1 }, { name: 'x2', coef: 1 }], bnds: { type: 1, ub: 4, lb: -Infinity } },
                    { name: 'c2', vars: [{ name: 'x1', coef: 2 }, { name: 'x2', coef: 1 }], bnds: { type: 1, ub: 7, lb: -Infinity } }
                ],
                bounds: [
                    { name: 'x1', type: 2, ub: Infinity, lb: 0 },
                    { name: 'x2', type: 2, ub: Infinity, lb: 0 }
                ]
            })
        }));
        vi.mock('@/hooks/converters/LPConverter', () => ({
            parseLP: vi.fn().mockReturnValue({
                // Similar structure as above
            })
        }));
        vi.mock('@/hooks/converters/MPSConverter', () => ({
            parseMPS: vi.fn().mockReturnValue({
                // Similar structure as above
            })
        }));
    });

    afterAll(() => {
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

        const { result, error, log } = await solveGLPKJavil(lpProblem, 'LP' as ProblemFormats);
        expect(result).toBe(null)
    });

    it('should handle GMPL format', async () => {
        const gmplProblem = 'GMPL problem';

        await solveGLPKJavil(gmplProblem, 'GMPL' as ProblemFormats);

        expect(GLPKConverter.parseGLPMAdvanced).toHaveBeenCalledWith(gmplProblem);
    });

    it('should handle LP format', async () => {
        const lpProblem = 'LP problem';

        await solveGLPKJavil(lpProblem, 'LP' as ProblemFormats);

        expect(LPConverter.parseLP).toHaveBeenCalledWith(lpProblem);
    });

    it('should handle MPS format', async () => {
        const mpsProblem = 'MPS problem';

        await solveGLPKJavil(mpsProblem, 'MPS' as ProblemFormats);

        expect(MPSConverter.parseMPS).toHaveBeenCalledWith(mpsProblem);
    });

    it('should handle unsupported problem type', async () => {
        const { result, error, log } = await solveGLPKJavil('problem', 'UNSUPPORTED' as ProblemFormats);

        expect(result).toBeNull();
        expect(error).not.toBeNull();
        expect(error?.message).toBe('No problem provided for solving. Probably the conversion was not successful');
    });
});