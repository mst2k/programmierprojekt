// glpkWorker.js
importScripts('./glpk.js');

self.onmessage = function (e) {
    console.log("TEST")
    const log = (value) => {
        // Post log messages back to the main thread
        self.postMessage({ action: 'log', message: value });
    };

    const obj = e.data;
    const result = {};
    let objective;

    try {

        // Create the problem
        const tran = glp_mpl_alloc_wksp();
        console.log(obj.data)
        readC

        glp_mpl_read_model(tran, null,
            function(){
                if (pos < str.length){
                    //console.log(str[pos+1]);
                    return str[pos++];
                } else
                    return -1;
            },
            false
        )
        glp_scale_prob(lp, GLP_SF_AUTO);

        // Solve the problem using simplex
        const smcp = new SMCP({ presolve: GLP_ON });
        glp_simplex(lp, smcp);

        // If MIP is selected, solve it as an integer optimization
        if (obj.mip) {
            glp_intopt(lp);
            objective = glp_mip_obj_val(lp); // Get the MIP objective value
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
            }
        } else {
            // Get the objective value from simplex method
            objective = glp_get_obj_val(lp);
            for (let i = 1; i <= glp_get_num_cols(lp); i++) {
                result[glp_get_col_name(lp, i)] = glp_get_col_prim(lp, i);
            }
        }

        // Log success message
        log('Optimization completed successfully.');
    } catch (err) {
        // Log any errors that occur
        log(`Error: ${err.message}`);
        console.log( err.message)
    } finally {
        // Send the final result and objective value back to the main thread
        self.postMessage({ action: 'done', result, objective });
        console.log("FINALLY")
    }
};
