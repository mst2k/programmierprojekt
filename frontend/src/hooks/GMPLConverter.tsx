import { LP } from "@/interfaces/LP.tsx";
import { Constraint } from "@/interfaces/Constraint.tsx";
import { Bound } from "@/interfaces/Bound.tsx";
import { Variable } from "@/interfaces/Variable.tsx";

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
        if(lp.bounds){
            let bound = lp.bounds?.find(b => b.name === variable);
            let lb = bound?.lb ?? 0;
            let ub = bound?.ub;

            glpmString += `var ${variable}`;
            if (lb !== undefined) {
                glpmString += ` >= ${lb}`;
            }
            if (ub !== undefined && ub !== Infinity) {
                glpmString += ` <= ${ub}`;
            }
            glpmString += ';\n';
        }
    });

    // Zielfunktion definieren
    glpmString += '/* Objective function */\n';
    glpmString += lp.objective.direction === 1 ? 'maximize ' : 'minimize ';
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

        if (constraint.bnds.type === 1) { // >=
            glpmString += `${expr} >= ${constraint.bnds.lb};\n`;
        } else if (constraint.bnds.type === 2) { // <=
            glpmString += `${expr} <= ${constraint.bnds.ub};\n`;
        } else if (constraint.bnds.type === 3) { // =
            glpmString += `${expr} = ${constraint.bnds.lb};\n`;
        }
    });

    // Abschluss
    glpmString += 'end;\n';

    return glpmString;
}

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

    const direction = objectiveMatch[0].toLowerCase() === 'maximize' ? 1 : -1;
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
    const constraintsString = cleanedInput.split('subject to')[1]
        .split('end;')[0]
        .trim();
    const constraints = parseGMPLConstraints(constraintsString);

    const boundsMatches = [...cleanedInput.matchAll(/var\s+(\w+)\s*(>=|<=)?\s*([\d.]+)/g)];
    const bounds:Bound[] = boundsMatches.map(match => ({
        name: match[1],
        type: match[2] === '>=' ? 1 : (match[2] === '<=' ? 2 : 3),
        lb: match[2] === '>=' ? parseFloat(match[3]) : 0,
        ub: match[2] === '<=' ? parseFloat(match[3]) : Infinity
    }));

    return {
        name: 'LP_Model', // Model Name
        objective: {
            direction: direction,
            name: objectiveName,
            vars: objectiveVars
        },
        subjectTo: constraints,
        bounds: bounds
    } as LP;
}

function parseGMPLVariables(expression: string): Variable[] {
    const variableRegex = /([-+]?\s*\d*\.?\d*)\s*\*\s*(\w+)/g;
    const vars: Variable[] = [];
    let match;
    while ((match = variableRegex.exec(expression)) !== null) {
        const coef = parseFloat(match[1].replace(/\s+/g, '')) || 1;
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
        const type = match[3] === '<=' ? 2 : (match[3] === '>=' ? 1 : 3);
        const value = parseFloat(match[4]);
        constraints.push({
            name,
            vars,
            bnds: {
                type,
                ub: type === 2 ? value : undefined,
                lb: type === 1 ? value : undefined,
            }
        } as Constraint);
    }
    return constraints;
}
