import {LP} from "@/interfaces/LP.tsx";
import {Constraint} from "@/interfaces/Constraint.tsx";
import {Bound} from "@/interfaces/Bound.tsx";
import {Variable} from "@/interfaces/Variable.tsx";

export function convertToGLPM(lp:LP) {
    let glpmString = '';

    // Entscheidungvariablen definieren
    const variableNames:Set<string> = new Set();
    lp.objective.vars.forEach((variable:Variable) => variableNames.add(variable.name));
    lp.subjectTo.forEach((constraint:Constraint) =>
        constraint.vars.forEach((variable:Variable) => variableNames.add(variable.name))
    );

    // Variablen-Deklaration
    glpmString += '/* Declaration of decision variables */\n';
    variableNames.forEach((variable:string) => {
        if (lp.bounds) {
            let bound = lp.bounds.find((b: Bound) => b.name === variable);
            if (bound) {
                if (bound.lb !== -Infinity) {
                    glpmString += `var ${variable} >= ${bound.lb};\n`;
                }
                if (bound.ub !== Infinity) {
                    glpmString += `var ${variable} <= ${bound.ub};\n`;
                }
            } else {
                glpmString += `var ${variable} >= 0;\n`; // Default lower bound if not specified
            }
        }
    });

    // Zielfunktion definieren
    glpmString += '/* Objective function */\n';
    glpmString += lp.objective.direction === 1 ? 'maximize ' : 'minimize ';
    glpmString += `${lp.objective.name}: `;
    glpmString += lp.objective.vars
        .map((varObj:any) => `${varObj.coef} * ${varObj.name}`)
        .join(' + ');
    glpmString += ';\n';

    // Nebenbedingungen definieren
    glpmString += '/* Constraints */\n';
    lp.subjectTo.forEach((constraint:Constraint) => {
        glpmString += `subject to ${constraint.name}: `;
        const expr:string = constraint.vars
            .map((varObj:Variable) => `${varObj.coef} * ${varObj.name}`)
            .join(' + ');
        if (constraint.bnds.type === 1) { // <=
            glpmString += `${expr} <= ${constraint.bnds.ub};\n`;
        } else if (constraint.bnds.type === 2) { // >=
            glpmString += `${expr} >= ${constraint.bnds.lb};\n`;
        } else if (constraint.bnds.type === 3) { // =
            glpmString += `${expr} = ${constraint.bnds.ub};\n`;
        }
    });

    // Abschließen
    glpmString += 'end;\n';

    return glpmString;
}
export function parseGMPL(lpString:string): LP {
    const cleanedInput = lpString
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/#.*\n?/g, '').replace(/\s+/g, ' ')
        .trim();

    const objectiveMatch = cleanedInput
        .match(/maximize|minimize/i);
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
    const objectiveVars:Variable[] = parseGMPLVariables(objFunction);

    const constraintsMatch = cleanedInput.match(/subject to/i);
    if (!constraintsMatch) {
        throw new Error('Constraints not found');
    }
    const constraintsString = cleanedInput.split('subject to')[1]
                                        .split('end;')[0]
                                        .trim();
    const constraints = parseGMPLConstraints(constraintsString);

    const boundsMatches = [...cleanedInput.matchAll(/var\s+(\w+)\s*(>=|<=|=)?\s*([\d.]+)/g)];
    const bounds = boundsMatches.map(match => ({
        name: match[1],
        type: match[2] === '>=' ? 1 : (match[2] === '<=' ? 2 : 3),
        lb: match[2] === '>=' || match[2] === '=' ? parseFloat(match[3]) : 0,
        ub: match[2] === '<=' || match[2] === '=' ? parseFloat(match[3]) : Infinity
    }));

    return {
        name: 'LP_Model', // You can modify this to derive a specific name if available
        objective: {
            direction: direction,
            name: objectiveName,
            vars: objectiveVars
        },
        subjectTo: constraints,
        bounds: bounds
    };
}

// Hilfsfunktion zum Parsen von Variablen in der Form "4*x1 + 5*x2"
function parseGMPLVariables(expression: string): Variable[] {
    const variableRegex = /([-+]?\s*\d*\.?\d*)\s*\*\s*(\w+)/g;
    const vars: { name: string; coef: number }[] = [];
    let match;
    while ((match = variableRegex.exec(expression)) !== null) {
        const coef:number = parseFloat(match[1].replace(/\s+/g, '')) || 1;
        const name:string = match[2].trim();
        vars.push({ name, coef });
    }
    return vars;
}

// Hilfsfunktion zum Parsen der Nebenbedingungen
function parseGMPLConstraints(constraintsString: string):Constraint[] {
    const constraints = constraintsString.split('s.t.');
    return constraints.map((constraintStr, index) => {
        const [label, condition] = constraintStr.split(':');
        const name = label ? label.trim() : `Constraint${index + 1}`;
        const [expr, bound] = condition.split(/(<=|>=|=)/);
        const vars = parseGMPLVariables(expr);
        const type = bound.includes('<=') ? 2 : (bound.includes('>=') ? 1 : 3);
        const value = parseFloat(bound.replace(/[^0-9.]/g, ''));
        return {
            name,
            vars,
            bnds: {
                type,
                ub: type === 2 ? value : Infinity,
                lb: type === 1 ? value : 0
            }
        };
    });
}