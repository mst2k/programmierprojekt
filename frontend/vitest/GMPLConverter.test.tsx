import { describe, it, expect } from 'vitest';
import { parseGMPL, convertToGMPL } from '@/hooks/converters/GMPLConverter.tsx';
import { GLP_MAX, GLP_MIN, GLP_LO, GLP_UP, GLP_FX, GLP_DB } from "@/interfaces/glpkJavil/Bnds.tsx";
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
describe('parseGMPL', () => {
    it('should correctly parse a GMPL problem', () => {
        const gmplProblem = `
      minimize cost: 3 * x1 + 5 * x2;
      subject to
        c1: x1 + 2 * x2 >= 10;
        c2: x1 <= 6;
      var x1 >= 0;
      var x2 >= 0;
      end;
    `;
        const result:LP = {
            "name": "LP_Model",
            "objective": {
                "direction": 1,
                "name": "cost",
                "vars": [
                    {
                        "name": "x1",
                        "coef": 3
                    },
                    {
                        "name": "x2",
                        "coef": 5
                    }
                ]
            },
            "subjectTo": [
                {
                    "name": "c1",
                    "vars": [
                        {
                            "name": "x1",
                            "coef": 1
                        },
                        {
                            "name": "x2",
                            "coef": 2
                        }
                    ],
                    "bnds": {
                        "type": 2,
                        "ub": Infinity,
                        "lb": 10
                    }
                },
                {
                    "name": "c2",
                    "vars": [
                        {
                            "name": "x1",
                            "coef": 1
                        }
                    ],
                    "bnds": {
                        "type": 3,
                        "ub": 6,
                        "lb": 6
                    }
                }
            ],
            "bounds": [
                {
                    "name": "x1",
                    "type": 2,
                    "lb": 0,
                    "ub": Infinity
                },
                {
                    "name": "x2",
                    "type": 2,
                    "lb": 0,
                    "ub": Infinity
                }
            ],
            "binaries": [],
            "generals": []
        }

        const parsedLP:LP = parseGMPL(gmplProblem);

        expect(JSON.stringify(parsedLP, null, 2)).toBe(JSON.stringify(result, null, 2));
    });
});

describe('convertToGLPM', () => {
    it('should correctly convert LP model back to GMPL string', () => {
        const lpModel = {
            name: 'LP_Model',
            objective: {
                direction: GLP_MIN,
                name: 'cost',
                vars: [
                    { name: 'x1', coef: 3 },
                    { name: 'x2', coef: 5 }
                ]
            },
            subjectTo: [
                {
                    name: 'c1',
                    vars: [
                        { name: 'x1', coef: 1 },
                        { name: 'x2', coef: 2 }
                    ],
                    bnds: {
                        type: GLP_LO,
                        lb: 10,
                        ub: Infinity
                    }
                },
                {
                    name: 'c2',
                    vars: [
                        { name: 'x1', coef: 1 }
                    ],
                    bnds: {
                        type: GLP_UP,
                        lb: -Infinity,
                        ub: 6
                    }
                }
            ],
            bounds: [
                { name: 'x1', lb: 0, ub: Infinity, type: GLP_LO },
                { name: 'x2', lb: 0, ub: Infinity, type: GLP_LO }
            ]
        };

        const convertedString = convertToGMPL(lpModel);

        expect(convertedString).toContain('minimize cost: 3 * x1 + 5 * x2;');
        expect(convertedString).toContain('subject to c1: 1 * x1 + 2 * x2 >= 10;');
        expect(convertedString).toContain('subject to c2: 1 * x1 <= 6;');
        expect(convertedString).toContain('var x1 >= 0;');
        expect(convertedString).toContain('var x2 >= 0;');
        expect(convertedString).toContain('end;');
    });
});
