export interface LP{
    name: string;
    objective: {
        direction: number; // 1 for maximize, -1 for minimize
        name: string;
        vars: { name: string; coef: number }[];
    };
    subjectTo: {
        name: string;
        vars: { name: string; coef: number }[];
        bnds: { type: number; ub: number; lb: number };
    }[];
    bounds?: {
        name: string;
        type: number; // 1 for lower bound, 2 for upper bound, 3 for equal
        ub: number;
        lb: number;
    }[];
    binaries?: string[];
    generals?: string[];
    options?: Options;
}

interface Options {
    // Additional options can be added as needed
}


export function parseGMPL(lpString: string): LP {
    const cleanedInput = lpString.replace(/\/\*[\s\S]*?\*\//g, '').replace(/#.*\n?/g, '').replace(/\s+/g, ' ').trim();

    const objectiveMatch = cleanedInput.match(/maximize|minimize/i);
    if (!objectiveMatch) {
        throw new Error('Objective function not found');
    }

    const direction = objectiveMatch[0].toLowerCase() === 'maximize' ? 1 : -1;
    const [, ...objectiveParts] = cleanedInput.split(objectiveMatch[0]);
    const objective = objectiveParts.join('').split(';')[0].trim();

    const [objName, objFunction] = objective.split(':');
    const objectiveName = objName.trim();
    const objectiveVars = parseVariables(objFunction);

    const constraintsMatch = cleanedInput.match(/subject to/i);
    if (!constraintsMatch) {
        throw new Error('Constraints not found');
    }
    const constraintsString = cleanedInput.split('subject to')[1].split('end;')[0].trim();
    const constraints = parseConstraints(constraintsString);

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
function parseVariables(expression: string): { name: string; coef: number }[] {
    const variableRegex = /([-+]?\s*\d*\.?\d*)\s*\*\s*(\w+)/g;
    const vars: { name: string; coef: number }[] = [];
    let match;
    while ((match = variableRegex.exec(expression)) !== null) {
        const coef = parseFloat(match[1].replace(/\s+/g, '')) || 1;
        const name = match[2].trim();
        vars.push({ name, coef });
    }
    return vars;
}

// Hilfsfunktion zum Parsen der Nebenbedingungen
function parseConstraints(constraintsString: string): {
    name: string;
    vars: { name: string; coef: number }[];
    bnds: { type: number; ub: number; lb: number };
}[] {
    const constraints = constraintsString.split('s.t.');
    const parsedConstraints = constraints.map((constraintStr, index) => {
        const [label, condition] = constraintStr.split(':');
        const name = label ? label.trim() : `Constraint${index + 1}`;
        const [expr, bound] = condition.split(/(<=|>=|=)/);
        const vars = parseVariables(expr);
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
    return parsedConstraints;
}
