/*

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

 */