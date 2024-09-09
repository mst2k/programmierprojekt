importScripts('./glpk.js');

self.onmessage = function (e) {
    const log = (message) => {
        self.postMessage({ action: 'log', message });
    };

    const { problem, problemType, solverOptions } = e.data;
    const result = {};
    let objective;

    try {
        const lp = glpk.glp_create_prob();

        if (problemType === 'LP') {
            readLPFromString(lp, problem);
        } else if (problemType === 'GMPL') {
            const tran = glpk.glp_mpl_alloc_wksp();
            readGMPLFromString(tran, problem);
            glpk.glp_mpl_build_prob(tran, lp);
        } else if (problemType === 'MPS') {
            readMPSFromString(lp, problem);
        }

        // Apply simplex
        const smcp = new glpk.SMCP({ presolve: glpk.GLP_ON });
        glpk.glp_simplex(lp, smcp);

        // Solve as MIP if requested
        if (solverOptions.mip) {
            glpk.glp_intopt(lp);
            objective = glpk.glp_mip_obj_val(lp);
            for (let i = 1; i <= glpk.glp_get_num_cols(lp); i++) {
                result[glpk.glp_get_col_name(lp, i)] = glpk.glp_mip_col_val(lp, i);
            }
        } else {
            objective = glpk.glp_get_obj_val(lp);
            for (let i = 1; i <= glpk.glp_get_num_cols(lp); i++) {
                result[glpk.glp_get_col_name(lp, i)] = glpk.glp_get_col_prim(lp, i);
            }
        }

        log('Optimization completed successfully.');
    } catch (err) {
        log(`Error: ${err.message}`);
    } finally {
        self.postMessage({ action: 'done', result, objective });
    }
};

// Function to read LP from string
function readLPFromString(lp, problemString) {
    let pos = 0;
    glpk.glp_read_lp(lp, null, () => (pos < problemString.length ? problemString[pos++] : -1));
}

// Function to read GMPL from string
function readGMPLFromString(tran, problemString) {
    let pos = 0;
    glpk.glp_mpl_read_model(tran, null, () => (pos < problemString.length ? problemString[pos++] : -1), false);
}

// Function to read MPS from string
function readMPSFromString(lp, problemString) {
    let pos = 0;
    glpk.glp_read_mps(lp, glpk.GLP_MPS_FILE, null, () => (pos < problemString.length ? problemString[pos++] : -1));
}
