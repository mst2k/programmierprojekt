export interface LP{
    name: string;
    objective: {
        direction: number; // 1 for maximize, -1 for minimize
        name: string;
        vars: Variable[];
    };
    subjectTo: Constraint[];
    bounds?: Bound[];
    binaries?: string[];
    generals?: string[];
}

interface Constraint {
    name: string;
    vars: { name: string; coef: number }[];
    bnds: { type: number; ub: number; lb: number };
}

interface Bound{
    name: string;
    type: number; // 1 for lower bound, 2 for upper bound, 3 for equal
    ub: number;
    lb: number;
}

interface Variable {
    name: string;
    coef: number
}


// Test Data
const LPObject: LP = {
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

// Beispiel LP-Format-String
const lpString = `
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

const gmplString = '' +
    '/* The declaration of decision variables x1, x2 */ var x1 >= 0;\n' +
    'var x2 >=0;\n' +
    '/* Objective function */\n' +
    'maximize ObjectiveFunctionLabel : 4*x1 +2*x2; /* Constraints */\n' +
    'subject to label1: x1 + x2 = 2; s.t. label2: x1 + x2 >= 4; end;'

// Example usage:
const mpsString = `
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

function convertToGLPM(lp:any) {
    let glpmString = '';

    // Entscheidungvariablen definieren
    const variableNames = new Set();
    lp.objective.vars.forEach((variable:any) => variableNames.add(variable.name));
    lp.subjectTo.forEach((constraint:any) =>
        constraint.vars.forEach((variable:any) => variableNames.add(variable.name))
    );

    // Variablen-Deklaration
    glpmString += '/* Declaration of decision variables */\n';
    variableNames.forEach(variable => {
        const bound = lp.bounds?.find((b:any) => b.name === variable);
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
    lp.subjectTo.forEach((constraint:any) => {
        glpmString += `subject to ${constraint.name}: `;
        const expr = constraint.vars
            .map((varObj:any) => `${varObj.coef} * ${varObj.name}`)
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
    const objectiveVars = parseGMPLVariables(objFunction);

    const constraintsMatch = cleanedInput.match(/subject to/i);
    if (!constraintsMatch) {
        throw new Error('Constraints not found');
    }
    const constraintsString = cleanedInput.split('subject to')[1].split('end;')[0].trim();
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
function parseGMPLVariables(expression: string): { name: string; coef: number }[] {
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
function parseGMPLConstraints(constraintsString: string): {
    name: string;
    vars: { name: string; coef: number }[];
    bnds: { type: number; ub: number; lb: number };
}[] {
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


// Funktion zur Konvertierung in LP-Format
function convertToLP(lpData:any):string {
    let LPObject: LP;
    if (typeof(lpData) === "object"){
        try{
            LPObject = lpData
        }catch (error) {
            console.error("Error while parsing object", error);
            return ""
        }
    }
    else{
        try {
            // Konvertierung des JSON-Strings in ein JavaScript-Objekt
            LPObject = JSON.parse(lpData);

            // Hier könnte zusätzliche Validierung eingefügt werden, um sicherzustellen,
            // dass das Objekt dem LP-Interface entspricht. Das könnte z.B. mit TypeScript
            // Utility-Funktionen oder benutzerdefinierter Logik geschehen.

            // Zurückgeben des LP-Objekts
        } catch (error) {
            console.error("Error while parsing JSON-Strings:", error);
            return "";
        }
    }
    let lpFormat = '';
    // Objektive Funktion
    lpFormat += `${LPObject.objective.direction === 1 ? 'Maximize' : 'Minimize'}\n`;
    lpFormat += ` ${LPObject.objective.name}: `;
    LPObject.objective.vars.forEach((v, index) => {
        if (index > 0) lpFormat += ' + ';
        lpFormat += `${v.coef} ${v.name}`;
    });
    lpFormat += '\n';

    // Nebenbedingungen
    lpFormat += `Subject To\n`;
    lpData.subjectTo.forEach((c:any) => {
        lpFormat += ` ${c.name}: `;
        c.vars.forEach((v, index) => {
            if (index > 0) lpFormat += ' + ';
            lpFormat += `${v.coef} ${v.name}`;
        });
        const boundType = c.bnds.type === 1 ? '<=' : c.bnds.type === 2 ? '>=' : '=';
        lpFormat += ` ${boundType} ${c.bnds.ub}\n`;
    });

    // Schranken
    if (lpData.bounds) {
        lpFormat += `Bounds\n`;
        lpData.bounds.forEach((b:any) => {
            const boundType = b.type === 1 ? ' <= ' : b.type === 2 ? ' >= ' : ' = ';
            lpFormat += ` ${b.lb} ${boundType} ${b.name} ${boundType} ${b.ub}\n`;
        });
    }

    // End
    lpFormat += `End\n`;

    return lpFormat;
}

export function parseLP(lpString:any) {
    const lines = lpString.split("\n").map((line:any) => line.trim()).filter((line:any) => line.length > 0);
    let mode = '';
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
            if (bound) {
                if (lp.bounds) {
                    lp.bounds.push(bound);
                }
            }
        }
    }

    return lp;
}

function parseLPExpression(expr:any) {
    const regex = /([+-]?\s*\d*\.?\d*)\s*([a-zA-Z_][a-zA-Z_0-9]*)/g;
    let match;
    let vars = [];

    while ((match = regex.exec(expr)) !== null) {
        const coef = parseFloat(match[1].replace(/\s+/g, '') || '1');
        const name = match[2];
        vars.push({ name: name, coef: coef });
    }

    return vars;
}

function parseLPConstraint(constraint:any) {
    const operators = ["<=", ">=", "="];
    let operator = operators.find(op => constraint.includes(op));
    let [expr, bound] = constraint.split(operator);
    const vars = parseLPExpression(expr.trim());
    const boundValue = parseFloat(bound.trim());

    let boundType:number = 0;
    if (operator === "<=") {
        boundType = 1;
    } else if (operator === ">=") {
        boundType = 2;
    } else if (operator === "=") {
        boundType = 3;
    }

    return { vars, bound: { type: boundType, ub: boundValue, lb: -Infinity } };
}

function parseLPBound(boundStr:any) {
    const regex = /(\d*\.?\d*)\s*<=\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*<=\s*(\d*\.?\d*)/;
    const match = regex.exec(boundStr);
    if (match) {
        return {
            name: match[2],
            type: 1, // Lower and Upper bound
            lb: parseFloat(match[1]),
            ub: parseFloat(match[3])
        };
    }

    return null;
}

function convertToMPS(lp: LP) {
    let mpsString = '';

    // NAME section
    mpsString += `NAME          ${lp.name}\n`;

    // ROWS section
    mpsString += 'ROWS\n';
    mpsString += ` N  ${lp.objective.name}\n`; // Objective row
    lp.subjectTo.forEach(constraint => {
        if (constraint.bnds.type === 1) { // <=
            mpsString += ` L  ${constraint.name}\n`;
        } else if (constraint.bnds.type === 2) { // >=
            mpsString += ` G  ${constraint.name}\n`;
        } else if (constraint.bnds.type === 3) { // =
            mpsString += ` E  ${constraint.name}\n`;
        }
    });

    // COLUMNS section
    mpsString += 'COLUMNS\n';
    const variableMap = {};
    lp.objective.vars.forEach(varObj => {
        if (!variableMap[varObj.name]) {
            variableMap[varObj.name] = [];
        }
        variableMap[varObj.name].push({ row: lp.objective.name, coef: varObj.coef });
    });
    lp.subjectTo.forEach(constraint => {
        constraint.vars.forEach(varObj => {
            if (!variableMap[varObj.name]) {
                variableMap[varObj.name] = [];
            }
            variableMap[varObj.name].push({ row: constraint.name, coef: varObj.coef });
        });
    });

    for (const [variable, rows] of Object.entries(variableMap)) {
        rows.forEach(entry => {
            mpsString += `    ${variable}  ${entry.row}  ${entry.coef}\n`;
        });
    }

    // RHS section
    mpsString += 'RHS\n';
    lp.subjectTo.forEach(constraint => {
        if (constraint.bnds.type === 1 || constraint.bnds.type === 3) { // <= or =
            mpsString += `    RHS1  ${constraint.name}  ${constraint.bnds.ub}\n`;
        } else if (constraint.bnds.type === 2) { // >=
            mpsString += `    RHS1  ${constraint.name}  ${constraint.bnds.lb}\n`;
        }
    });

    // BOUNDS section
    if (lp.bounds && lp.bounds.length > 0) {
        mpsString += 'BOUNDS\n';
        lp.bounds.forEach(bound => {
            if (bound.lb !== -Infinity) {
                mpsString += ` LO BND1  ${bound.name}  ${bound.lb}\n`;
            }
            if (bound.ub !== Infinity) {
                mpsString += ` UP BND1  ${bound.name}  ${bound.ub}\n`;
            }
        });
    }

    // ENDATA section
    mpsString += 'ENDATA\n';

    return mpsString;
}

function parseMPS(mpsString:string) {
    const lines = mpsString.split("\n").map(line => line.trim()).filter(line => line !== '');
    let lp:LP = {
        name: "",
        objective: {
            direction: 1,
            name: "",
            vars: []
        },
        subjectTo: [],
        bounds: []
    };
    let currentSection = "";
    let rhsName = ""; // To track the name used in the RHS section

    const constraintsMap = {}; // Temporary map to hold constraints
    const rhsMap = {}; // Map to hold RHS values

    lines.forEach(line => {
        if (line.startsWith("NAME")) {
            lp.name = line.split(/\s+/)[1];
        } else if (line === "ROWS") {
            currentSection = "ROWS";
        } else if (line === "COLUMNS") {
            currentSection = "COLUMNS";
        } else if (line === "RHS") {
            currentSection = "RHS";
        } else if (line === "BOUNDS") {
            currentSection = "BOUNDS";
        } else if (line === "ENDATA") {
            currentSection = "ENDATA";
        } else {
            switch (currentSection) {
                case "ROWS":
                    handleRowsSection(line, lp, constraintsMap);
                    break;
                case "COLUMNS":
                    handleColumnsSection(line, lp, constraintsMap);
                    break;
                case "RHS":
                    handleRHSSection(line, rhsMap, rhsName);
                    break;
                case "BOUNDS":
                    handleBoundsSection(line, lp);
                    break;
            }
        }
    });

    // Combine constraints and RHS values
    Object.keys(constraintsMap).forEach(constraintName => {
        if (rhsMap[constraintName] !== undefined) {
            const constraint:any = constraintsMap[constraintName];
            constraint.bnds = inferBoundType(rhsMap[constraintName]);
            lp.subjectTo.push(constraint);
        }
    });

    return lp;
}

function handleRowsSection(line:any, lp:any, constraintsMap:any) {
    const parts = line.split(/\s+/);
    const type = parts[0];
    const name = parts[1];

    if (type === "N") {
        lp.objective.name = name;
    } else {
        constraintsMap[name] = {
            name: name,
            vars: [],
            bnds: { type: 1, lb: -Infinity, ub: Infinity } // Initialize with default
        };
        if (type === "L") {
            constraintsMap[name].bnds.type = 1; // Less than or equal
        } else if (type === "G") {
            constraintsMap[name].bnds.type = 2; // Greater than or equal
        } else if (type === "E") {
            constraintsMap[name].bnds.type = 3; // Equal
        }
    }
}

function handleColumnsSection(line:any, lp:any, constraintsMap:any) {
    const parts = line.split(/\s+/);
    const variable = parts[0];
    const constraintName = parts[1];
    const coefficient = parseFloat(parts[2]);

    if (constraintName === lp.objective.name) {
        lp.objective.vars.push({ name: variable, coef: coefficient });
    } else {
        if (constraintsMap[constraintName]) {
            constraintsMap[constraintName].vars.push({ name: variable, coef: coefficient });
        }
    }
}

function handleRHSSection(line:any, rhsMap:any) {
    const parts = line.split(/\s+/);
    const constraintName = parts[1];
    rhsMap[constraintName] = parseFloat(parts[2]);
}

function handleBoundsSection(line:any, lp:any) {
    const parts = line.split(/\s+/);
    const boundType = parts[0];
    const variable = parts[2];
    const value = parseFloat(parts[3]);

    if (boundType === "LO") {
        lp.bounds.push({ name: variable, type: 1, lb: value, ub: Infinity });
    } else if (boundType === "UP") {
        const existingBound = lp.bounds.find((b:any) => b.name === variable);
        if (existingBound) {
            existingBound.ub = value;
        } else {
            lp.bounds.push({ name: variable, type: 1, lb: -Infinity, ub: value });
        }
    }
}

function inferBoundType(rhsValue:any) {
    return {
        name:"",
        type: rhsValue === 0 ? 3 : 1, // Infer type (<= or =) based on value
        lb: -Infinity,
        ub: rhsValue
    };
}



// Ausführen der Parsing-Funktion
let lpInterface = parseLP(lpString);
console.log("___________________PARSE LP________________________")
console.log(JSON.stringify(lpInterface, null, 2));

lpInterface = parseGMPL(gmplString);
console.log("___________________PARSE GMPL________________________")
console.log(JSON.stringify(lpInterface, null, 2));

lpInterface = parseMPS(mpsString);
console.log("___________________PARSE MPS________________________")
console.log(JSON.stringify(lpInterface, null, 2));


console.log("___________________Convert to LP________________________")
// Ausgabe des LP-Formats
console.log(convertToLP(LPObject));

console.log("___________________Convert to LP________________________")
// Ausgabe des LP-Formats
console.log(convertToGLPM(LPObject));

console.log("___________________Convert to MPS________________________")
// Ausgabe des LP-Formats
console.log(convertToMPS(LPObject));
