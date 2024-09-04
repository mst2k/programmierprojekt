// Funktion zur Konvertierung in LP-Format
//
/*
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

 */