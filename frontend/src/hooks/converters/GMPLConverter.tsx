import { LP } from "@/interfaces/glpkJavil/LP.tsx";
import { Constraint } from "@/interfaces/glpkJavil/Constraint.tsx";
import { Bound } from "@/interfaces/glpkJavil/Bound.tsx";
import { Variable } from "@/interfaces/glpkJavil/Variable.tsx";
import {GLP_UP, GLP_LO, GLP_FX, GLP_DB, GLP_MAX, GLP_MIN} from "@/interfaces/glpkJavil/Bnds.tsx";

export function parseGMPL(lpString: string): LP {
    const cleanedInput = lpString
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/#.*\n?/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const objectiveMatch = cleanedInput.match(/maximize|minimize/i);
    if (!objectiveMatch) {
        throw new Error('Objective function not found');
    }

    const direction = objectiveMatch[0].toLowerCase() === 'maximize' ? GLP_MAX : GLP_MIN;
    const [, ...objectiveParts] = cleanedInput.split(objectiveMatch[0]);
    const objective = objectiveParts.join('')
        .split(';')[0]
        .trim();

    const [objName, objFunction] = objective.split(':');
    const objectiveName = objName.trim();
    const objectiveVars: Variable[] = parseGMPLVariables(objFunction);

    const constraintsMatch = cleanedInput.match(/subject to/i);
    if (!constraintsMatch) {
        throw new Error('Constraints not found');
    }

    let index_sub_to = cleanedInput.indexOf('subject to');
    index_sub_to = index_sub_to === -1 ? Infinity : index_sub_to;
    let index_st = cleanedInput.indexOf('s.t.');
    index_st = index_st === -1 ? Infinity : index_st;
    const index = index_sub_to < index_st ? index_sub_to + 'subject to'.length : index_st + 's.t.'.length;
    const constraintsString = cleanedInput.slice(index)
        .split('end;')[0]
        .trim();
    const constraints = parseGMPLConstraints(constraintsString);

    // Regex zur Erkennung von Schranken und Binaries/Integers
    let bound_finder = cleanedInput.replace(/integer/g, "");

    bound_finder = bound_finder.replace(/binary/g, "")


    const boundsMatches = [...bound_finder.matchAll(/var\s+(?:integer\s+|binary\s+)?(\w+)\s*(>=|<=)?\s*(-?\d*\.?\d*)?\s*(<=|>=)?\s*(-?\d*\.?\d*)?\s*;/g)];

    const bounds: Bound[] = boundsMatches.map(match => {
        let parsedValue;
        const varName = match[1]; // Variable Name
        let lb: number = -Infinity, ub: number = Infinity;

        if (match[2] === ">=") {
            parsedValue = parseFloat(match[3]);
            if (!isNaN(parsedValue)) {
                lb = parsedValue;
            }
        }
        if (match[2] === "<=") {
            parsedValue = parseFloat(match[3]);
            if (!isNaN(parsedValue)) {
                ub = parsedValue;
            }
        }

        if (match[4] === ">=") {
            let parsedValue = parseFloat(match[5]);
            if (!isNaN(parsedValue)) {
                lb = Math.max(lb, parsedValue);
            }
        }
        if (match[4] === "<=") {
            let parsedValue = parseFloat(match[5]);
            if (!isNaN(parsedValue)) {
                ub = Math.min(ub, parsedValue);
            }
        }
        if (!match[2] && !match[3] && !match[4] && !match[5]){
            lb = 0
        }

        // Determine the type based on the bounds
        let type;
        if (lb > -Infinity && ub <Infinity)
            type = GLP_DB;
        else if (lb > -Infinity) {
            type = GLP_LO; // Only lower bound is specified
        } else if (ub < Infinity) {
            type = GLP_UP; // Only upper bound is specified
        } else {
            type = GLP_FX; // Default type when no bounds are given, as a fallback
        }

        return {
            name: varName,
            type: type,
            lb: lb > -Infinity ? lb : 0, // Default lower bound to 0
            ub: ub < Infinity ? ub : Infinity, // Default upper bound to infinity
        };
    });




    // Erkennung von Integer- und Binary-Variablen
    const integerMatches = [...cleanedInput.matchAll(/var\s+(\w+)\s+integer\s*(?:[<>]=?\s*\d*|=\s*\d*);/g)].map(match => match[1]);
    const binaryMatches = [...cleanedInput.matchAll(/var\s+(\w+)\s+binary\s*(?:[<>]=?\s*\d*|=\s*\d*)?;/g)].map(match => match[1]);

    return {
        name: 'LP_Model',
        objective: {
            direction: direction,
            name: objectiveName,
            vars: objectiveVars
        },
        subjectTo: constraints,
        bounds: bounds,
        binaries: binaryMatches,
        generals: integerMatches
    } as LP;
}


export function convertToGLPM(lp: LP): string {
    let glpmString = '';

    // Entscheidungvariablen definieren
    const variableNames: Set<string> = new Set();
    lp.objective.vars.forEach((variable: Variable) => variableNames.add(variable.name));
    lp.subjectTo.forEach((constraint: Constraint) =>
        constraint.vars.forEach((variable: Variable) => variableNames.add(variable.name))
    );

    // Variablen-Deklaration
    glpmString += '/* Declaration of decision variables */\n';
    variableNames.forEach((variable: string) => {
        if (lp.bounds) {
            let bound = lp.bounds.find(b => b.name === variable);
            if (bound) {
                let lb = bound.lb;
                let ub = bound.ub;

                // Variable Deklaration starten
                glpmString += `var ${variable}`;

                // Falls es eine binäre Variable ist, fügen wir direkt "binary" hinzu
                if (lp.binaries && lp.binaries.includes(variable)) {
                    glpmString += ` binary`;
                }
                // Falls es eine Ganzzahlvariable ist
                else if (bound.type === GLP_FX || bound.type === GLP_LO || bound.type === GLP_UP) {
                    // Ganzzahligkeit prüfen
                    if (lp.generals && lp.generals.includes(variable)) {
                        glpmString += ` integer`;
                    }
                    // Schranken (Bounds) hinzufügen
                    if (!isNaN(lb) && lb !== -Infinity) {
                        glpmString += ` >= ${lb}`;
                    }
                    if (!isNaN(ub) && ub !== Infinity) {
                        glpmString += ` <= ${ub}`;
                    }
                }

                // Deklaration abschließen
                glpmString += ';\n';
            }
        }
    });

    // Zielfunktion definieren
    glpmString += '/* Objective function */\n';
    glpmString += lp.objective.direction === GLP_LO ? 'maximize ' : 'minimize ';
    glpmString += `${lp.objective.name}: `;
    glpmString += lp.objective.vars
        .map((varObj: Variable) => `${varObj.coef} * ${varObj.name}`)
        .join(' + ');
    glpmString += ';\n';

    // Nebenbedingungen definieren
    glpmString += '/* Constraints */\n';
    lp.subjectTo.forEach((constraint: Constraint) => {
        glpmString += `subject to ${constraint.name}: `;
        const expr: string = constraint.vars
            .map((varObj: Variable) => `${varObj.coef} * ${varObj.name}`)
            .join(' + ');

        if (constraint.bnds.type === GLP_LO) { // >=
            glpmString += `${expr} >= ${constraint.bnds.lb};\n`;
        } else if (constraint.bnds.type === GLP_UP) { // <=
            glpmString += `${expr} <= ${constraint.bnds.ub};\n`;
        } else if (constraint.bnds.type === GLP_FX) { // =
            glpmString += `${expr} = ${constraint.bnds.ub};\n`;
        }
    });

    // Abschluss
    glpmString += 'end;\n';

    return glpmString;
}







function parseGMPLVariables(expression: string): Variable[] {
    const variableRegex = /([-+]?\s*\d*\.?\d*)?\s*\*?\s*(\w+)/g;
    const vars: Variable[] = [];
    let match;
    while ((match = variableRegex.exec(expression)) !== null) {
        let coefStr = match[1]?.replace(/\s+/g, '') || '1';
        // Wenn das Vorzeichen nur "-" oder "+" ist, auf "-1" bzw. "1" setzen
        if (coefStr === '-' || coefStr === '+') {
            coefStr += '1';
        }
        const coef = parseFloat(coefStr);
        const name = match[2].trim();
        vars.push({ name, coef });
    }
    return vars;
}


function parseGMPLConstraints(constraintsString: string): Constraint[] {
    const constraintRegex = /([\w\d_]+)\s*:\s*(.*?)(<=|>=|=)\s*(-?\d*\.?\d+)\s*;/g;
    const constraints: Constraint[] = [];
    let match;
    while ((match = constraintRegex.exec(constraintsString)) !== null) {
        const name = match[1];
        const expr = match[2].trim();
        const vars = parseGMPLVariables(expr);
        const type = match[3] === '<=' ? GLP_UP : (match[3] === '>=' ? GLP_LO : GLP_FX);
        const value = parseFloat(match[4]);
        constraints.push({
            name,
            vars,
            bnds: {
                type,
                ub: type === GLP_UP ? value : Infinity,
                lb: type === GLP_FX ? value : GLP_LO ? value : -Infinity,
            }
        } as Constraint);
    }
    return constraints;
}
