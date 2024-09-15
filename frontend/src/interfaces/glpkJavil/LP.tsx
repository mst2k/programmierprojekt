import {Variable} from "@/interfaces/glpkJavil/Variable.tsx";
import {Bound} from "@/interfaces/glpkJavil/Bound.tsx";
import {Options} from "autoprefixer";
import {Constraint} from "@/interfaces/glpkJavil/Constraint.tsx";

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