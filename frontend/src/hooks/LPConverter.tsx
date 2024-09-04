import { LP } from "@/interfaces/LP.tsx";
import { Bound } from "@/interfaces/Bound.tsx";
import { Variable } from "@/interfaces/Variable.tsx";
import {Bnds} from "@/interfaces/Bnds.tsx";

// Funktion zur Konvertierung eines LP-Objekts in das LP-Format
export function convertToLP(lpData: LP): string {
    let lpFormat = '';

    // Objektive Funktion
    lpFormat += `${lpData.objective.direction === 1 ? 'Maximize' : 'Minimize'}\n`;
    lpFormat += ` ${lpData.objective.name}: `;
    lpData.objective.vars.forEach((v, index) => {
        if (index > 0) lpFormat += ' + ';
        lpFormat += `${v.coef} ${v.name}`;
    });
    lpFormat += '\n';

    // Nebenbedingungen
    lpFormat += `Subject To\n`;
    lpData.subjectTo.forEach((c) => {
        lpFormat += ` ${c.name}: `;
        c.vars.forEach((v, index) => {
            if (index > 0) lpFormat += ' + ';
            lpFormat += `${v.coef} ${v.name}`;
        });
        const boundType = c.bnds.type === 1 ? '<=' : c.bnds.type === 2 ? '>=' : '=';
        lpFormat += ` ${boundType} ${c.bnds.ub ?? c.bnds.lb}\n`;
    });

    // Schranken
    if (lpData.bounds && lpData.bounds.length > 0) {
        lpFormat += `Bounds\n`;
        lpData.bounds.forEach((b) => {
            lpFormat += ` ${b.lb} <= ${b.name} <= ${b.ub}\n`;
        });
    }

    // End
    lpFormat += `End\n`;

    return lpFormat;
}

// Funktion zum Parsen eines LP-Strings in ein LP-Objekt
export function parseLP(lpString: string): LP {
    const lines = lpString.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    let mode: string = '';
    let lp: LP = {
        name: '',
        objective: {
            direction: 1, // 1 for maximize, -1 for minimize
            name: '',
            vars: []
        },
        subjectTo: [],
        bounds: []
    };

    for (let line of lines) {
        if (line.startsWith("Maximize")) {
            lp.objective.direction = 1;
            mode = 'objective';
            continue;
        } else if (line.startsWith("Minimize")) {
            lp.objective.direction = -1;
            mode = 'objective';
            continue;
        } else if (line.startsWith("Subject To")) {
            mode = 'subjectTo';
            continue;
        } else if (line.startsWith("Bounds")) {
            mode = 'bounds';
            continue;
        } else if (line.startsWith("End")) {
            mode = 'end';
            continue;
        }

        // Parse based on current mode
        if (mode === 'objective') {
            const [name, expr] = line.split(":");
            lp.objective.name = name.trim();
            lp.objective.vars = parseLPExpression(expr.trim());
        } else if (mode === 'subjectTo') {
            const [name, expr] = line.split(":");
            const { vars, bound } = parseLPConstraint(expr.trim());
            lp.subjectTo.push({
                name: name.trim(),
                vars: vars,
                bnds: bound
            });
        } else if (mode === 'bounds') {
            const bound = parseLPBound(line.trim());
            if (bound && lp.bounds) {
                lp.bounds.push(bound);
            }
        }
    }

    return lp;
}

// Hilfsfunktion zum Parsen einer LP-Expression
function parseLPExpression(expr: string): Variable[] {
    const regex = /([+-]?\s*\d*\.?\d*)\s*([a-zA-Z_][a-zA-Z_0-9]*)/g;
    let match;
    let vars: Variable[] = [];

    while ((match = regex.exec(expr)) !== null) {
        let temp_coef = match[1].replace(/\s+/g, '').trim() || '1';
        temp_coef = temp_coef === "-" || temp_coef === '+' ? `${temp_coef}1`: temp_coef;
        const coef = parseFloat(temp_coef);
        const name = match[2];
        vars.push({ name: name, coef: coef });
    }

    return vars;
}

// Hilfsfunktion zum Parsen einer LP-Nebenbedingung
function parseLPConstraint(constraint: string): { vars: Variable[], bound: Bnds } {
    const operators = ["<=", ">=", "="];
    let operator = operators.find(op => constraint.includes(op));
    if (!operator) {
        throw new Error("Invalid constraint format");
    }

    const [expr, boundStr] = constraint.split(operator);
    const vars:Variable[] = parseLPExpression(expr.trim());
    const boundValue = parseFloat(boundStr.trim());

    let boundType: 1 | 2 | 3 = 1;
    if (operator === "<=") {
        boundType = 1;
    } else if (operator === ">=") {
        boundType = 2;
    } else if (operator === "=") {
        boundType = 3;
    }

    const bound: Bnds = {
        type: boundType,
        lb: boundType === 1 ? undefined : boundValue,
        ub: boundType === 1 ? boundValue : undefined
    };

    return { vars, bound };
}

// Hilfsfunktion zum Parsen der Schranken (Bounds)
function parseLPBound(boundStr: string): Bound | null {
    // Regex to handle "<= x <=" and also "lb <= x" and "x <= ub"
    const regex = /(\d*\.?\d*)?\s*(<=|>=)?\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(<=|>=|=)?\s*(\d*\.?\d*)?/;
    const match = regex.exec(boundStr);

    if (match) {
        const lb = match[1] ? parseFloat(match[1]) : undefined;
        const varName = match[3];
        const ub = match[5] ? parseFloat(match[5]) : undefined;

        let type: 1 | 2 | 3;
        if (match[2] === "<=" && match[4] === "<=") {
            type = 1; // lb <= x <= ub
        } else if (match[2] === ">=") {
            type = 2; // lb >= x
        } else if (match[4] === "=") {
            type = 3; // x = ub
        } else {
            type = 1; // Default to 1 if only one bound is present (x <= ub or lb <= x)
        }

        return {
            type,
            name: varName,
            lb: lb !== undefined ? lb : -Infinity,
            ub: ub !== undefined ? ub : Infinity
        };
    }
    return null;
}
