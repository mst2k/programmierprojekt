import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSolver } from '@/hooks/solvers/useSolver';
import { ProblemFormats, Solvers } from '@/interfaces/SolverConstants';
import * as GLPKHgourvest from '@/hooks/solvers/GLPKHgourvest';
import * as HiGHS from '@/hooks/solvers/HiGHS';
import * as GLPKJavil from '@/hooks/solvers/GLPKJavil';

// Mock the solver modules
vi.mock('@/hooks/solvers/GLPKHgourvest', () => ({
    default: vi.fn(),
}));

vi.mock('@/hooks/solvers/HiGHS', () => ({
    default: vi.fn(),
}));

vi.mock('@/hooks/solvers/GLPKJavil', () => ({
    solveGLPKJavil: vi.fn(),
}));

describe('useSolver', () => {
    const mockProblem = 'mock problem';
    const mockProblemType: ProblemFormats = 'LP';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should solve using GLPKHgourvest', async () => {
        const mockResult = { result: { status: 'Optimal' }, log: 'Solved' };
        vi.mocked(GLPKHgourvest.default).mockResolvedValue(mockResult);

        let hook;
        await act(async () => {
            hook = renderHook(() => useSolver(mockProblem, mockProblemType, 'GLPKHgourvest'));
        });

        expect(GLPKHgourvest.default).toHaveBeenCalledWith(mockProblem, mockProblemType);
        expect(hook.result.current.result).toEqual({ ...mockResult.result, Duration: expect.any(Number) });
        expect(hook.result.current.log).toBe('Solved');
        expect(hook.result.current.error).toBeNull();
    });

    it('should solve using HiGHS', async () => {
        const mockResult = { result: { status: 'Optimal' }, log: 'Solved with HiGHS' };
        vi.mocked(HiGHS.default).mockResolvedValue(mockResult);

        let hook;
        await act(async () => {
            hook = renderHook(() => useSolver(mockProblem, mockProblemType, 'Highs'));
        });

        expect(HiGHS.default).toHaveBeenCalledWith(mockProblem, mockProblemType);
        expect(hook.result.current.result).toEqual({ ...mockResult.result, Duration: expect.any(Number) });
        expect(hook.result.current.log).toBe('Solved with HiGHS');
        expect(hook.result.current.error).toBeNull();
    });

    it('should solve using GLPKJavil', async () => {
        const mockResult = { result: { status: 'Optimal' }, log: 'Solved with GLPKJavil' };
        vi.mocked(GLPKJavil.solveGLPKJavil).mockResolvedValue(mockResult);

        let hook;
        await act(async () => {
            hook = renderHook(() => useSolver(mockProblem, mockProblemType, 'GLPKJavil'));
        });

        expect(GLPKJavil.solveGLPKJavil).toHaveBeenCalledWith(mockProblem, mockProblemType);
        expect(hook.result.current.result).toEqual({ ...mockResult.result, Duration: expect.any(Number) });
        expect(hook.result.current.log).toBe('Solved with GLPKJavil');
        expect(hook.result.current.error).toBeNull();
    });

    it('should handle errors', async () => {
        const mockError = new Error('Solver error');
        vi.mocked(GLPKHgourvest.default).mockRejectedValue(mockError);

        let hook;
        await act(async () => {
            hook = renderHook(() => useSolver(mockProblem, mockProblemType, 'GLPKHgourvest'));
        });

        expect(hook.result.current.error).toBe(mockError);
        expect(hook.result.current.result).toBeNull();
    });

    it('should allow solving with different parameters', async () => {
        const mockResult1 = { result: { status: 'Optimal' }, log: 'Solved 1' };
        const mockResult2 = { result: { status: 'Optimal' }, log: 'Solved 2' };
        vi.mocked(GLPKHgourvest.default)
            .mockResolvedValueOnce(mockResult1)
            .mockResolvedValueOnce(mockResult2);

        let hook;
        await act(async () => {
            hook = renderHook(() => useSolver(mockProblem, mockProblemType, 'GLPKHgourvest'));
        });

        expect(hook.result.current.log).toBe('Solved 1');

        await act(async () => {
            hook.result.current.solve('new problem', 'MIP', 'GLPKHgourvest');
        });

        expect(GLPKHgourvest.default).toHaveBeenCalledTimes(2);
        expect(GLPKHgourvest.default).toHaveBeenLastCalledWith('new problem', 'MIP');
        expect(hook.result.current.log).toBe('Solved 2');
    });
});