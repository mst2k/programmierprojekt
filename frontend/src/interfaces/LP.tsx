import {Variable} from "@/interfaces/Variable.tsx";
import {Bnds} from "@/interfaces/Bnds.tsx";
import {Bound} from "@/interfaces/Bound.tsx";
import {Options} from "autoprefixer";

export interface LP {
    name: string,
    objective: {
        direction: number,
        name: string,
        vars: Variable[]
    },
    subjectTo: {
        name: string,
        vars: Variable[],
        bnds: Bnds
    }[],
    bounds?: Bound[],
    binaries?: string[],
    generals?: string[],
    options?: Options
}