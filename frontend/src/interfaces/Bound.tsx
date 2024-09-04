export interface Bound{
    name: string;
    type: number; // 1 for lower bound, 2 for upper bound, 3 for equal
    ub: number;
    lb: number;
}