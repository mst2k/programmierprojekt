export interface Bnds{ type: number, ub: number, lb: number }

export const GLP_FR = 1;  /* free (unbounded) variable */
export const GLP_LO = 2;  /* variable with lower bound */
export const GLP_UP = 3;  /* variable with upper bound */
export const GLP_DB = 4;  /* double-bounded variable */
export const GLP_FX = 5;  /* fixed variable */
export const GLP_MAX = 2;
export const GLP_MIN = 1