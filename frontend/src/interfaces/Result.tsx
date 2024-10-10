/**
 * Represents the result of a solver operation.
 * @interface
 */
export interface SolverResult {
    Status: 'Optimal' | 'Infeasible' | 'Unbounded' | 'Error' | 'Unknown';
    ObjectiveValue: number;
    Columns: { [key: string]: ColumnData };
    Rows: RowData[];
    Output?:string;
    Duration?:number
    DurationSolving?:number
}

/**
 * Represents data for a single column in the solver result (Decision Variables).
 * @interface
 */
export interface ColumnData {
    Index: number;
    Status: 'Basic' | 'Lower Bound' | 'Upper Bound' | 'Free' | 'Fixed' | 'Unknown';
    Lower: number;
    Upper: number;
    Type: 'Continuous' | 'Integer' | 'Binary'; // Adjust if other types are used
    Primal: number;
    Dual: number;
    Name: string;
}

/**
 * Represents data for a single row in the solver result (Constraints).
 * @interface
 */
export interface RowData {
    Index: number;
    Name: string;
    Status: 'Basic' | 'Lower Bound' | 'Upper Bound' | 'Free' | 'Fixed' | 'Unknown';
    Lower: number;
    Upper: number;
    Primal: number;
    Dual: number;
}
