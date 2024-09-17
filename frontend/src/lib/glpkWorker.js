importScripts("./glpk.js")

self.onmessage = function (e) {
    const log = (message) => {
        self.postMessage({ action: 'log', message });
    };

    const { prob, probtype } = e.data;
    let result = null;
    let output_result = null;
    let objective = null;
    let output = "";

    function captureOutput(message) {
        output += `${message}\n`;
    }
    glp_set_print_func(captureOutput);

    try {
        // Setze die eigene Print-Funktion
        glp_set_print_func(log);

        const lp = glp_create_prob();

        if (probtype === 'LP') {
            readLPFromString(lp, prob);
        } else if (probtype === 'GMPL') {
            const tran = glp_mpl_alloc_wksp();
            readGMPLFromString(tran, prob);
            glp_mpl_generate(tran, null, captureOutput);
            glp_mpl_build_prob(tran, lp);
            glp_mpl_postsolve(tran, lp, GLP_MIP);
        } else {
            // Problemtyp wird nicht unterstützt
            self.postMessage({ action: 'done', result: output_result, objective, output, error: Error(`Unsupported problem type: ${probtype}`).message });
            return;
        }

        // Überprüfe, ob es ganzzahlige oder binäre Variablen gibt, um den MIP-Solver zu aktivieren
        const hasIntegerVariables = glp_get_num_int(lp) > 0;

        if (hasIntegerVariables) {
            // Falls MIP aktivieren, benutze den MIP-Solver
            log('Solving as MIP...');
            var iocp = new IOCP({presolve: GLP_ON});
            glp_intopt(lp, iocp);
            objective = glp_mip_obj_val(lp);
            result = {};
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);  // MIP-Werte auslesen
            }
        } else {
            // Kontinuierliche Lösung mit Simplex
            log('Solving as LP...');
            const smcp = new SMCP({ presolve: GLP_ON });
            glp_simplex(lp, smcp);
            objective = glp_get_obj_val(lp);
            result = {};
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_get_col_prim(lp, i);  // Simplex-Werte auslesen
            }
        }

        output_result = createJSONReport(lp, hasIntegerVariables);  // JSON-Ausgabe erstellen
        log('Optimization completed successfully.');

    } catch (err) {
        log(`Error: ${err.message}`);
        self.postMessage({ action: 'done', error: err.message });
        return;
    }

    self.postMessage({ action: 'done', result: output_result, objective, output });
};


// Function to read LP from string
function readLPFromString(lp, problemString) {
    let pos = 0;
    glp_read_lp(lp, null, () => (pos < problemString.length ? problemString[pos++] : -1));
}

// Function to read GMPL from string
function readGMPLFromString(tran, problemString) {
    let pos = 0;
    glp_mpl_read_model(tran, null, () => (pos < problemString.length ? problemString[pos++] : -1), false);
}

// Function to read MPS from string
function createJSONReport(lp, isMIP) {
    // Status der Lösung
    const status = isMIP ? glp_mip_status(lp) : glp_get_status(lp); // Unterscheidung für MIP
    const statusMappingObjective = {
        5: 'Optimal',
        2: 'Feasible',
        3: 'Infeasible',
        4: 'No Feasible',
        1: 'Undefined',
        6: 'Unbounded'
    };

    const statusMappingVariable = {
        1: 'Basic',
        2: 'Lower Bound',
        3: 'Upper Bound',
        4: 'Free',
        5: 'Fixed'
    };

    // Zielfunktionswert
    const objectiveValue = isMIP ? glp_mip_obj_val(lp) : glp_get_obj_val(lp);

    // Variablen
    const columns = {};
    const numCols = glp_get_num_cols(lp);

    for (let j = 1; j <= numCols; j++) {
        const varName = glp_get_col_name(lp, j);
        const primal = isMIP ? glp_mip_col_val(lp, j) : glp_get_col_prim(lp, j);  // Primärlösung je nach MIP/LP
        const dual = !isMIP ? glp_get_col_dual(lp, j) : null;  // Dual nur für LP
        let lowerBound = glp_get_col_lb(lp, j);
        if(lowerBound === -1.7976931348623157e+308) lowerBound = -Infinity;
        let upperBound = glp_get_col_ub(lp, j);
        if(upperBound === 1.7976931348623157e+308) upperBound = -Infinity;
        const status = glp_get_col_stat(lp, j);

        // Variablentyp ermitteln
        const colKind = glp_get_col_kind(lp, j);
        let varType = 'Continuous';  // Standardmäßig Continuous
        if (colKind === GLP_IV) {
            varType = 'Integer';
        } else if (colKind === GLP_BV) {
            varType = 'Binary';
        }

        columns[varName] = {
            Index: j - 1,  // Zero-based index
            Status: statusMappingVariable[status] || 'Unknown',
            Lower: lowerBound,
            Upper: upperBound,
            Type: varType,
            Primal: primal,
            Dual: dual,  // Dual-Werte nur bei LP
            Name: varName
        };
    }

    // Constraints
    const rows = [];
    const numRows = glp_get_num_rows(lp);

    for (let i = 1; i <= numRows; i++) {
        const rowName = glp_get_row_name(lp, i);
        const primal = isMIP ? glp_mip_row_val(lp, i) : glp_get_row_prim(lp, i);  // Primärlösung je nach MIP/LP
        const dual = !isMIP ? glp_get_row_dual(lp, i) : null;  // Dual nur für LP
        let lowerBound = glp_get_row_lb(lp, i);
        if(lowerBound === -1.7976931348623157e+308) lowerBound = -Infinity;
        let upperBound = glp_get_row_ub(lp, i);
        if(upperBound === 1.7976931348623157e+308) upperBound = Infinity;
        const status = glp_get_row_stat(lp, i);

        rows.push({
            Index: i - 1,  // Zero-based index
            Name: rowName,
            Status: statusMappingVariable[status] || 'Unknown',
            Lower: lowerBound,
            Upper: upperBound,
            Primal: primal,
            Dual: dual  // Dual-Werte nur bei LP
        });
    }

    // Erstelle das JSON-Objekt
    return {
        Status: statusMappingObjective[status] || 'Unknown',
        ObjectiveValue: objectiveValue,
        Columns: columns,
        Rows: rows
    };
}

