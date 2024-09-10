import {Variable} from "@/interfaces/Variable.tsx";
import {Bound} from "@/interfaces/Bound.tsx";
import {Options} from "autoprefixer";
import {Constraint} from "@/interfaces/Constraint.tsx";

export interface LP {
    name: string,
    objective: {
        direction: number,
        name: string,
        vars: Variable[]
    },
    subjectTo: Constraint[],
    bounds?: Bound[],
    binaries?: string[],
    generals?: string[],
    options?: Options
}