export interface Result {
    name: string;
    time: number;
    result: {
        status: number;
        z: number;
        vars: {[key:string]: number};
        dual?: { [key: string]: number }; /* simplex only */
    };
}