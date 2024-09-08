import {LP} from "@/interfaces/LP.tsx";


export const lpObject: LP = {
    name: "ExampleLP",
    objective: {
        direction: 1, // 1 für Maximierung, -1 für Minimierung
        name: "obj",
        vars: [
            { name: "x1", coef: 1 },
            { name: "x2", coef: 2 },
            { name: "x3", coef: 3 },
            { name: "x4", coef: 1 }
        ]
    },
    subjectTo: [
        {
            name: "c1",
            vars: [
                { name: "x1", coef: -1 },
                { name: "x2", coef: 1 },
                { name: "x3", coef: 1 },
                { name: "x4", coef: 10 }
            ],
            bnds: { type: 1, ub: 20, lb: -Infinity }
        },
        {
            name: "c2",
            vars: [
                { name: "x1", coef: 1 },
                { name: "x2", coef: -3 },
                { name: "x3", coef: 1 }
            ],
            bnds: { type: 1, ub: 30, lb: -Infinity }
        },
        {
            name: "c3",
            vars: [
                { name: "x2", coef: 1 },
                { name: "x4", coef: -3.5 }
            ],
            bnds: { type: 3, ub: 0, lb: 0 }
        }
    ],
    bounds: [
        {
            name: "b1",
            type: 1,
            lb: 0,
            ub: 40
        },
        {
            name: "b2",
            type: 1,
            lb: 2,
            ub: 3
        }
    ]
};

//Beispiel LP-Format-String
export const lpString = `
Maximize
 obj: x1 + 2 x2 + 3 x3 + x4
Subject To
 c1: - x1 + x2 + x3 + 10 x4 <= 20
 c2: x1 - 3 x2 + x3 <= 30
 c3: x2 - 3.5 x4 = 0
Bounds
 0 <= x1 <= 40
 2 <= x4 <= 3
End
`;



export const gmplString = '' +
    '/* The declaration of decision variables x1, x2 */ var x1 >= 0;\n' +
    'var x2 >=0;\n' +
    '/* Objective function */\n' +
    'maximize ObjectiveFunctionLabel : 4*x1 +2*x2; /* Constraints */\n' +
    'subject to label1: x1 + x2 = 2; s.t. label2: x1 + x2 >= 4; end;'

// Example usage:
// export const mpsString = `
// NAME          ExampleLP
// ROWS
//  N  obj
//  L  c1
//  L  c2
//  E  c3
// COLUMNS
//     x1  obj  1
//     x2  obj  2
//     x3  obj  3
//     x4  obj  1
//     x1  c1  -1
//     x2  c1  1
//     x3  c1  1
//     x4  c1  10
//     x1  c2  1
//     x2  c2  -3
//     x3  c2  1
//     x2  c3  1
//     x4  c3  -3.5
// RHS
//     RHS1  c1  20
//     RHS1  c2  30
//     RHS1  c3  0
// BOUNDS
//  LO BND1  x1  0
//  UP BND1  x1  40
//  LO BND1  x4  2
//  UP BND1  x4  3
// ENDATA
// `;
