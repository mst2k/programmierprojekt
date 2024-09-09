import {Variable} from "@/interfaces/Variable.tsx";
import {Bnds} from "@/interfaces/Bnds.tsx";

export interface Constraint {
    name: string;
    vars: Variable[];
    bnds: Bnds;
}