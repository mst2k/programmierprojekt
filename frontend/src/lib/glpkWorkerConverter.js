importScripts('./glpk.js');

self.onmessage = function (e) {
    let lpString = "";
    try {
        const {prob} = e.data;
        const lp = glp_create_prob();
        const tran = glp_mpl_alloc_wksp();
        readGMPLFromString(tran, prob);
        glp_mpl_generate(tran, null, console.log);
        glp_mpl_build_prob(tran, lp);
        glp_write_lp(lp, null,
            function(str){
            lpString += `${str}\n`;
            }
        );
        self.postMessage({ action: 'done', lpString });
    } catch (err) {
        self.postMessage({ action: 'done', error: err.message });
    }
};


// Function to read GMPL from string
function readGMPLFromString(tran, problemString) {
    let pos = 0;
    glp_mpl_read_model(tran, null, () => (pos < problemString.length ? problemString[pos++] : -1), false);
}
