importScripts('./glpk.js');



self.onmessage = function (e) {
    const log = (message) => {
        self.postMessage({ action: 'log', message });
    };

    const { prob, probtype } = e.data;
    let result = null;
    let output_result = null
    let objective = null;
    let output = "";


    function captureOutput(message) {
        output += `${message}\n`
    }
    glp_set_print_func(captureOutput);

    const solverOptions = { mip: false };
    
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
            //Problem Type Not supported
            self.postMessage({ action: 'done', result:output_result, objective , output, error: Error(`Unsupported problem type: ${probtype}`).message});
        }

        // Apply simplex
        const smcp = new SMCP({ presolve: GLP_ON });
        glp_simplex(lp, smcp);


        // Solve as MIP if requested
        if (solverOptions.mip) {
            glp_intopt(lp);
            objective = glp_mip_obj_val(lp);
            result = {};
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
            }
        } else {
            objective = glp_get_obj_val(lp);
            result = {};
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_get_col_prim(lp, i);
            }
        }

        output_result = createJSONReport(lp)

        log('Optimization completed successfully.');
    } catch (err) {
        log(`Error: ${err.message}`);
        self.postMessage({ action: 'done', error: err.message });
        return;
    }

    self.postMessage({ action: 'done', result:output_result, objective , output});
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
function readMPSFromString(lp, problemString) {
    let pos = 0;
    glp_read_mps(lp, GLP_MPS_FILE, null, () => (pos < problemString.length ? problemString[pos++] : -1));
}


function createJSONReport(lp) {
    // Status der Lösung
    const status = glp_get_status(lp);
    const statusMapping = {
        GLP_OPT: 'Optimal',
        GLP_FEAS: 'Feasible',
        GLP_INFEAS: 'Infeasible',
        GLP_NOFEAS: 'No Feasible',
        GLP_UNBND: 'Unbounded',
        GLP_UNDEF: 'Undefined'
    };

    // Zielfunktionswert
    const objectiveValue = glp_get_obj_val(lp);

    // Variablen
    const columns = {};
    const numCols = glp_get_num_cols(lp);

    for (let j = 1; j <= numCols; j++) {
        const varName = glp_get_col_name(lp, j);
        const primal = glp_get_col_prim(lp, j);
        const dual = glp_get_col_dual(lp, j);
        const lowerBound = glp_get_col_lb(lp, j);
        const upperBound = glp_get_col_ub(lp, j);
        const status = glp_get_col_stat(lp, j);

        const statusMapping = {
            1: 'Basic',
            2: 'Lower Bound',
            3: 'Upper Bound',
            4: 'Free',
            5: 'Fixed'
        };

        columns[varName] = {
            Index: j - 1,  // Zero-based index
            Status: statusMapping[status] || 'Unknown',
            Lower: lowerBound,
            Upper: upperBound,
            Type: 'Continuous',  // Assume Continuous; adjust if needed
            Primal: primal,
            Dual: dual,
            Name: varName
        };
    }

    // Constraints
    const rows = [];
    const numRows = glp_get_num_rows(lp);

    for (let i = 1; i <= numRows; i++) {
        const rowName = glp_get_row_name(lp, i);
        const primal = glp_get_row_prim(lp, i);
        const dual = glp_get_row_dual(lp, i);
        const lowerBound = glp_get_row_lb(lp, i);
        const upperBound = glp_get_row_ub(lp, i);
        const status = glp_get_row_stat(lp, i);

        const statusMapping = {
            GLP_BS: 'Basic',
            GLP_NL: 'Lower Bound',
            GLP_NU: 'Upper Bound',
            GLP_NF: 'Free',
            GLP_NS: 'Fixed'
        };

        rows.push({
            Index: i - 1,  // Zero-based index
            Name: rowName,
            Status: statusMapping[status] || 'Unknown',
            Lower: lowerBound,
            Upper: upperBound,
            Primal: primal,
            Dual: dual
        });
    }

    // Erstelle das JSON-Objekt
    return {
        Status: statusMapping[status] || 'Unknown',
        ObjectiveValue: objectiveValue,
        Columns: columns,
        Rows: rows
    }; // Formatierung für bessere Lesbarkeit
}
