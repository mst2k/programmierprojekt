import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';

import ResultComponent from '@/components/ui/general/displayRestult'
import useSolver from "@/hooks/solvers/useSolver";
import { Solvers } from "@/interfaces/SolverConstants";

// Mock the translation function
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}))

// Mock the useSolver hook
vi.mock('@/hooks/solvers/useSolver', () => ({
    default: vi.fn(),
}))

describe('ResultComponent', () => {
    const mockProps = {
        lpProblem: 'mock problem',
        problemType: 'LP',
        lpSolver: 'GLPK',
    }


    it('renders loading state', () => {
        vi.mocked(useSolver).mockReturnValue({
            solve(prob: any, ProblemFormats: any, solver: Solvers): Promise<void> {
                return Promise.resolve(undefined);
            },
            isLoading: true,
            result: null,
            error: null,
            log: ''
        });
        const { container } = render(<ResultComponent {...mockProps} />);
        // Find the element by class name
        const loaderElement = container.querySelector('.lucide-loader-circle');
        expect(loaderElement).toBeInTheDocument();  // Überprüft den Ladezustand
    });

    it('renders error state', () => {
        vi.mocked(useSolver).mockReturnValue({
            solve(prob: any, ProblemFormats: any, solver: Solvers): Promise<void> {
                return Promise.resolve(undefined);
            },
            isLoading: false,
            result: null,
            error: new Error('error_title'),
            log: ''
        });
        render(<ResultComponent {...mockProps} />);
        // Ensure the error message is present and displayed twice
        const errorMessages = screen.getAllByText('error_title');
        expect(errorMessages.length).toBe(2);  // Überprüft, ob der Fehlertext zweimal angezeigt wird
    });


    it('renders result state', () => {
        vi.mocked(useSolver).mockReturnValue({
            solve(prob: any, ProblemFormats: any, solver: Solvers): Promise<void> {
                return Promise.resolve(undefined);
            },
            isLoading: false,
            result: {
                Status: 'Optimal',
                ObjectiveValue: 100,
                Columns: {},
                Rows: [],
                Output: '',
            },
            error: null,
            log: ''
        })
        render(<ResultComponent {...mockProps} />)
        expect(screen.getByText('solver_result_title')).toBeInTheDocument()  // Überprüft das Ergebnis
        expect(screen.getByText('Optimal')).toBeInTheDocument()  // Überprüft den Status des Ergebnisses
    })
})
