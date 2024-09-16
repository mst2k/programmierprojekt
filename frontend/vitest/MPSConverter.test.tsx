import { describe, it, expect } from 'vitest';
import { convertToMPS, parseMPS } from '@/hooks/converters/MPSConverter.tsx';
import { LP } from '@/interfaces/glpkJavil/LP.tsx';
import { GLP_UP, GLP_LO, GLP_FX, GLP_MAX } from '@/interfaces/glpkJavil/Bnds.tsx';

describe('MPS Conversion Tests', () => {
    const lpSample: LP = {
        name: 'TestLP',
        objective: {
            direction: GLP_MAX,
            name: 'obj',
            vars: [
                { name: 'x1', coef: 3 },
                { name: 'x2', coef: 5 },
            ]
        },
        subjectTo: [
            {
                name: 'c1',
                vars: [
                    { name: 'x1', coef: 1 },
                    { name: 'x2', coef: 2 }
                ],
                bnds: { type: GLP_UP, lb: -Infinity, ub: 100 }
            },
            {
                name: 'c2',
                vars: [
                    { name: 'x1', coef: 2 },
                    { name: 'x2', coef: 3 }
                ],
                bnds: { type: GLP_LO, lb: 20, ub: Infinity }
            }
        ],
        bounds: [
            { name: 'x1', type: GLP_LO, lb: 0, ub: Infinity },
            { name: 'x2', type: GLP_UP, lb: -Infinity, ub: 40 }
        ],
        binaries: [],
        generals: []
    };

    it('should correctly convert LP to MPS format', () => {
        const mpsString = convertToMPS(lpSample);
        expect(mpsString).toContain('NAME          TestLP');
        expect(mpsString).toContain(' N  obj');
        expect(mpsString).toContain(' L  c1');
        expect(mpsString).toContain(' G  c2');
        expect(mpsString).toContain(' x1  obj  3');
        expect(mpsString).toContain(' RHS1  c1  100');
        expect(mpsString).toContain(' LO BND1  x1  0');
        expect(mpsString).toContain(' UP BND1  x2  40');
        expect(mpsString).toContain('ENDATA');
    });

    it('should correctly parse MPS back to LP format', () => {
        const mpsString = convertToMPS(lpSample);
        const parsedLP = parseMPS(mpsString);

        expect(JSON.stringify(parsedLP, null, 2)).toBe(JSON.stringify(lpSample, null, 2));

    });
});
