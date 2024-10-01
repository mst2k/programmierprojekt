import { convertToLP, parseLP } from "@/hooks/converters/LPConverter.tsx";
import { GLP_MAX, GLP_MIN, GLP_UP, GLP_LO, GLP_FX } from "@/interfaces/glpkJavil/Bnds.tsx";
import { LP } from "@/interfaces/glpkJavil/LP";
import { describe, it, expect }  from "vitest";

// Beispiel LP-Daten zum Testen
const exampleLP: LP = {
    name: "TestLP",
    objective: {
        direction: GLP_MAX,
        name: "obj",
        vars: [
            { name: "x1", coef: 3 },
            { name: "x2", coef: 5 }
        ]
    },
    subjectTo: [
        {
            name: "c1",
            vars: [
                { name: "x1", coef: 1 },
                { name: "x2", coef: 1 }
            ],
            bnds: { type: GLP_UP, lb: -Infinity, ub: 100 }
        },
        {
            name: "c2",
            vars: [
                { name: "x1", coef: 2 },
                { name: "x2", coef: 3 }
            ],
            bnds: { type: GLP_LO, lb: 50, ub: Infinity }
        },
        {
            name: "c3",
            vars: [
                { name: "x1", coef: 1 }
            ],
            bnds: { type: GLP_FX, lb: 40, ub: 40 }
        }
    ],
    bounds: [
        { name: "x1", type: GLP_LO, lb: 0, ub: Infinity },
        { name: "x2", type: GLP_UP, lb: -Infinity, ub: 100 }
    ],
    binaries: ["x3"],
    generals: ["x4"]
};

// Test für convertToLP
describe("convertToLP", () => {
    it("konvertiert ein LP-Objekt in das LP-Format", () => {
        const expectedLPString = `
Maximize
 obj: 3 x1 + 5 x2
Subject To
 c1: 1 x1 + 1 x2 <= 100
 c2: 2 x1 + 3 x2 >= 50
 c3: 1 x1 = 40
Bounds
 0 <= x1
 x2 <= 100
Binary
 x3
General
 x4
End
        `.trim();

        const lpString = convertToLP(exampleLP).trim();
        expect(lpString).toEqual(expectedLPString);
    });
});

// Test für parseLP
describe("parseLP", () => {
    it("parsed ein LP-Format korrekt in ein LP-Objekt und konvertiert wieder zurück", () => {
        const lpString = `
Maximize
 obj: 3 x1 + 5 x2
Subject To
 c1: 1 x1 + 1 x2 <= 100
 c2: 2 x1 + 3 x2 >= 50
 c3: 1 x1 = 40
Bounds
 x1 <= 0
 x2 <= 199
Binary
 x3
General
 x4
End
        `.trim();

        const parsedLP = parseLP(lpString);
        const lpResultString = convertToLP(parsedLP);
        expect(lpResultString.trim()).toBe(lpString.trim())


    });
});
