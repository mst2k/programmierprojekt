importScripts('./glpk.js');

self.onmessage = function (e) {
    const log = (message) => {
        self.postMessage({ action: 'log', message });
    };

    const { prob, probtype } = e.data;
    let result = null;
    let objective = null;

    const solverOptions = { mip: false };
    
    try {
        const lp = glp_create_prob();

        if (probtype === 'LP') {
            readLPFromString(lp, prob);
        } else if (probtype === 'GMPL') {
            const tran = glp_mpl_alloc_wksp();
            readGMPLFromString(tran, prob);
            glp_mpl_generate(tran, null, console.log);
            glp_mpl_build_prob(tran, lp);
        } else if (probtype === 'MPS') {
            readMPSFromString(lp, prob);
        } else {
            throw new Error(`Unsupported problem type: ${probtype}`);
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

        log('Optimization completed successfully.');
    } catch (err) {
        log(`Error: ${err.message}`);
        self.postMessage({ action: 'done', error: err.message });
        return;
    }

    console.log("RESULTAUSWORKER:", result);
    self.postMessage({ action: 'done', result, objective });
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