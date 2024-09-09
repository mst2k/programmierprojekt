import {LP} from "@/interfaces/glpkJavil/LP.tsx";


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



export const gmplString = `
/* decision variables*/
var x1 >= 0;
var x2 >=0;
/* Objective function */ 
maximize label : 4*x1 +5*x2; 
/* Constraints */
subject to label1: x1 + 2*x2 <= 40; 
s.t. label2: 4*x1 + 3*x2 <= 120;
end;
`

export const gmpl2String = `
var x11 integer >=0;
var x12 integer >=0;
var x21 integer >=0;
var x22 binary >=0; 

minimize transportkosten: 4*x11 + 6*x12 + 5*x21 + 3*x22;
subject to lager1kap: x11+x12 <= 60;
s.t. lager2kap: x21+x22 <= 40.5;
s.t. ziel1bedarf: x21+x11 = 50;
s.t. ziel2bedarf: x12+x22 = 50; 
`

// Example usage:
export const mpsString = `
NAME          ExampleLP
ROWS
 N  obj
 L  c1
 L  c2
 E  c3
COLUMNS
    x1  obj  1
    x2  obj  2
    x3  obj  3
    x4  obj  1
    x1  c1  -1
    x2  c1  1
    x3  c1  1
    x4  c1  10
    x1  c2  1
    x2  c2  -3
    x3  c2  1
    x2  c3  1
    x4  c3  -3.5
RHS
    RHS1  c1  20
    RHS1  c2  30
    RHS1  c3  0
BOUNDS
 LO BND1  x1  0
 UP BND1  x1  40
 LO BND1  x4  2
 UP BND1  x4  3
ENDATA
`;

export const gmplStringTransp = `
# A TRANSPORTATION PROBLEM
#
# This problem finds a least cost shipping schedule that meets
# requirements at markets and supplies at factories.
#
#  References:
#              Dantzig G B, "Linear Programming and Extensions."
#              Princeton University Press, Princeton, New Jersey, 1963,
#              Chapter 3-3.

set I;
/* canning plants */

set J;
/* markets */

param a{i in I};
/* capacity of plant i in cases */

param b{j in J};
/* demand at market j in cases */

param d{i in I, j in J};
/* distance in thousands of miles */

param f;
/* freight in dollars per case per thousand miles */

param c{i in I, j in J} := f * d[i,j] / 1000;
/* transport cost in thousands of dollars per case */

var x{i in I, j in J} >= 0;
/* shipment quantities in cases */

minimize cost: sum{i in I, j in J} c[i,j] * x[i,j];
/* total transportation costs in thousands of dollars */

s.t. supply{i in I}: sum{j in J} x[i,j] <= a[i];
/* observe supply limit at plant i */

s.t. demand{j in J}: sum{i in I} x[i,j] >= b[j];
/* satisfy demand at market j */



solve;

# Report / Result Section (Optional)
printf '#################################\\n';
printf 'Transportation Problem / LP Model Result\\n';
printf '\\n';
printf 'Minimum Cost = %.2f\\n', cost;
printf '\\n';

printf '\\n';
printf 'Variables  (i.e. shipment quantities in cases ) \\n';

printf 'Shipment quantities in cases\\n';
printf 'Canning Plants  Markets   Solution (Cases) \\n';
printf{i in I, j in J}:'%14s %10s %11s\\n',i,j, x[i,j];
printf '\\n';

printf 'Constraints\\n';
printf '\\n';
printf 'Observe supply limit at plant i\\n';
printf 'Canning Plants Solution Sign  Required\\n';
for {i in I} {
 printf '%14s %10.2f <= %.3f\\n', i, sum {j in J} x[i,j], a[i];
   }

printf '\\n';
printf 'Satisfy demand at market j\\n';
printf 'Market Solution Sign  Required\\n';
for {j in J} {
 printf '%5s %10.2f >= %.3f\\n', j, sum {i in I} x[i,j], b[j];
   }



data;

set I := Seattle San-Diego;

set J := New-York Chicago Topeka;

param a := Seattle     350
           San-Diego   600;

param b := New-York    325
           Chicago     300
           Topeka      275;

param d :              New-York   Chicago   Topeka :=
           Seattle     2.5        1.7       1.8
           San-Diego   2.5        1.8       1.4  ;

param f := 90;

end;

`
