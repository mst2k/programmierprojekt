import {Variable} from "@/interfaces/Variable.tsx";

export interface Constraint {
    name: string;
    vars: Variable[];
    bnds: { type: number; ub: number; lb: number };
}