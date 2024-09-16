import {Variable} from "@/interfaces/glpkJavil/Variable.tsx";
import {Bnds} from "@/interfaces/glpkJavil/Bnds.tsx";

export interface Constraint {
    name: string;
    vars: Variable[];
    bnds: Bnds;
}