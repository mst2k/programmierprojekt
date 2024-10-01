import { LP } from "@/interfaces/glpkJavil/LP.tsx";
import { Bound } from "@/interfaces/glpkJavil/Bound.tsx";
import { Variable } from "@/interfaces/glpkJavil/Variable.tsx";
import {Bnds, GLP_MAX, GLP_MIN} from "@/interfaces/glpkJavil/Bnds.tsx";
import { GLP_UP, GLP_LO, GLP_FX, GLP_FR, GLP_DB } from "@/interfaces/glpkJavil/Bnds.tsx";

// Funktion zur Konvertierung eines LP-Objekts in das LP-Format
export function convertToLP(lpData: LP): string {
    let lpFormat = '';

    // Objektive Funktion
    lpFormat += `${lpData.objective.direction === GLP_MAX ? 'Maximize' : 'Minimize'}\n`;
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
        const boundType = c.bnds.type === GLP_UP ? `<= ${c.bnds.ub}` : c.bnds.type === GLP_LO ? `>= ${c.bnds.lb}` : `= ${c.bnds.lb}`;
        lpFormat += ` ${boundType}\n`;
    });

    // Schranken
    if (lpData.bounds && lpData.bounds.length > 0) {
        lpFormat += `Bounds\n`;
        lpData.bounds.forEach((b) => {
            if (b.type === GLP_FX) {
                lpFormat += ` ${b.lb} = ${b.name}\n`;
            } else {
                lpFormat += ` ${(b.lb !== null && b.lb !== -Infinity)? b.lb + ' <= ' : ''}${b.name}${(b.ub !== null && b.ub!== Infinity) ? ' <= ' + b.ub : ''}\n`;
            }
        });
    }

    // Binärvariablen
    if (lpData.binaries && lpData.binaries.length > 0) {
        lpFormat += `Binary\n`;
        lpData.binaries.forEach((bin) => {
            lpFormat += ` ${bin}\n`;
        });
    }

    // Ganzzahlvariablen
    if (lpData.generals && lpData.generals.length > 0) {
        lpFormat += `General\n`;
        lpData.generals.forEach((gen) => {
            lpFormat += ` ${gen}\n`;
        });
    }

    // End
    lpFormat += `End\n`;

    return lpFormat;
}

export function parseLP(lpString: string): LP {
    const lines = lpString.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    let mode: string = '';
    let lp: LP = {
        name: '',
        objective: {
            direction: GLP_MAX, // 1 for maximize, -1 for minimize
            name: '',
            vars: []
        },
        subjectTo: [],
        bounds: [],
        binaries: [],
        generals: []
    };

    let objectiveExpr = ''; // Sammelvariable für das gesamte Objektiv
    let constraintExpr = ''; // Sammelvariable für eine Nebenbedingung
    let currentConstraintName = ''; // Der aktuelle Nebenbedingungsname

    for (let line of lines) {
        if (line.startsWith("Maximize")) {
            lp.objective.direction = GLP_MAX;
            mode = 'objective';
            continue;
        } else if (line.startsWith("Minimize")) {
            lp.objective.direction = GLP_MIN;
            mode = 'objective';
            continue;
        } else if (line.startsWith("Subject To")) {
            // Verarbeite das gesammelte Ziel, bevor wir zu den Nebenbedingungen wechseln
            if (objectiveExpr.length > 0) {
                lp.objective.vars = parseLPExpression(objectiveExpr.trim());
                objectiveExpr = ''; // Zurücksetzen für den nächsten Modus
            }
            mode = 'subjectTo';
            continue;
        } else if (line.startsWith("Bounds")) {
            // Verarbeite alle gesammelten Nebenbedingungen, bevor wir zu "Bounds" wechseln
            if (constraintExpr.length > 0 && currentConstraintName.length > 0) {
                const { vars, bound } = parseLPConstraint(constraintExpr.trim());
                lp.subjectTo.push({
                    name: currentConstraintName,
                    vars: vars,
                    bnds: bound
                });
                constraintExpr = ''; // Zurücksetzen für den nächsten Modus
                currentConstraintName = ''; // Zurücksetzen
            }
            mode = 'bounds';
            continue;
        } else if (line.startsWith("Binary")) {
            mode = 'binaries';
            continue;
        } else if (line.startsWith("General")) {
            mode = 'generals';
            continue;
        } else if (line.startsWith("End")) {
            mode = 'end';
            continue;
        }

        // Parse based on current mode
        if (mode === 'objective') {
            const splitLine = line.split(":");
            if (splitLine.length === 2) {
                lp.objective.name = splitLine[0].trim(); // Falls der Name in der ersten Zeile steht
                objectiveExpr += splitLine[1].trim() + ' ';
            } else {
                objectiveExpr += line.trim() + ' '; // Mehrzeilige Erweiterung der Funktion
            }
        } else if (mode === 'subjectTo') {
            // Split the line by ":"
            const splitLine = line.split(":");
            if (splitLine.length === 2) {
                // If we encounter a new constraint, first save the previous one
                if (constraintExpr.length > 0 && currentConstraintName.length > 0) {
                    const { vars, bound } = parseLPConstraint(constraintExpr.trim());
                    lp.subjectTo.push({
                        name: currentConstraintName,
                        vars: vars,
                        bnds: bound
                    });
                }
                // Now, start collecting the new constraint
                currentConstraintName = splitLine[0].trim();
                constraintExpr = splitLine[1].trim() + ' ';
            } else {
                // Continue collecting the expression if it's multi-line
                constraintExpr += line.trim() + ' ';
            }
        } else if (mode === 'bounds') {
            const bound = parseLPBound(line.trim());
            if (bound && lp.bounds) {
                lp.bounds.push(bound);
            }
        } else if (mode === 'binaries') {
            lp.binaries?.push(line.trim());
        } else if (mode === 'generals') {
            lp.generals?.push(line.trim());
        }
    }

    // Verarbeite das gesammelte Ziel am Ende, falls "Subject To" nicht vorher kam
    if (objectiveExpr.length > 0) {
        lp.objective.vars = parseLPExpression(objectiveExpr.trim());
    }

    // Verarbeite die letzte Nebenbedingung am Ende, falls "Bounds" oder "End" nicht vorher kam
    if (constraintExpr.length > 0 && currentConstraintName.length > 0) {
        const { vars, bound } = parseLPConstraint(constraintExpr.trim());
        lp.subjectTo.push({
            name: currentConstraintName,
            vars: vars,
            bnds: bound
        });
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
        temp_coef = temp_coef === "-" || temp_coef === '+' ? `${temp_coef}1` : temp_coef;
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
    const vars: Variable[] = parseLPExpression(expr.trim());
    const boundValue = parseFloat(boundStr.trim());

    let boundType = GLP_UP;
    if (operator === "<=") {
        boundType = GLP_UP;
    } else if (operator === ">=") {
        boundType = GLP_LO;
    } else if (operator === "=") {
        boundType = GLP_FX;
    }
    let lb = boundType === GLP_FX ? boundValue : boundType === GLP_LO ? boundValue : -Infinity;
    let ub = boundType === GLP_UP ? boundValue : Infinity;

    const bound: Bnds = {
        type: boundType,
        lb: lb,
        ub: ub
    } as Bnds;

    return { vars, bound };
}

// Hilfsfunktion zum Parsen der Schranken (Bounds)
function parseLPBound(boundStr: string): Bound | null {
    // Regex to handle various bound formats
    const regex = /^([-]?\d*\.?\d*)?\s*(<=|>=|=)?\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(<=|>=|=)?\s*([-]?\d*\.?\d*)?$/;
    const match = regex.exec(boundStr.trim());

    if (match) {
        const [, lbStr, leftOp, varName, rightOp, ubStr] = match;
        let lb = lbStr ? parseFloat(lbStr) : undefined;
        let ub = ubStr ? parseFloat(ubStr) : undefined;
        let type: number;

        // Handle 'free' case
        if (boundStr.toLowerCase().includes('free')) {
            return {
                type: GLP_FR,
                name: varName,
                lb: -Infinity,
                ub: Infinity
            } as Bound;
        }

        // Determine bound type
        if (leftOp && rightOp) {
            if (leftOp === '<=' && rightOp === '<=') {
                type = GLP_DB; // Double bound
            } else if (leftOp === '>=' && rightOp === '>=') {
                type = GLP_DB; // Double bound (reverse order)
                [lb, ub] = [ub, lb]; // Swap lb and ub
            } else {
                return null; // Invalid combination
            }
        } else if (leftOp === '<=' || rightOp === '<=') {
            type = GLP_UP;
        } else if (leftOp === '>=' || rightOp === '>=') {
            type = GLP_LO;
        } else if (leftOp === '=' || rightOp === '=') {
            type = GLP_FX;
        } else {
            type = GLP_FR; // No bounds specified, assume free
        }

        return {
            type,
            name: varName,
            lb: lb !== undefined ? lb : -Infinity,
            ub: ub !== undefined ? ub : Infinity
        } as Bound;
    }
    return null;
}
