import {Result} from "@/interfaces/glpkJavil/Result.tsx";

export interface Options {
    mipgap?: number,    /* set relative mip gap tolerance to mipgap, default 0.0 */
    tmlim?: number,     /* limit solution time to tmlim seconds, default INT_MAX */
    msglev?: number,    /* message level for terminal output, default GLP_MSG_ERR */
    presol?: boolean,   /* use presolver, default true */
    cb?: {              /* a callback called at each 'each' iteration (only simplex) */
        call(result: Result):Result,
        each: number
    }
}