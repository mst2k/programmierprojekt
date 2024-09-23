import time
import tempfile
import os
from flask import Flask, request, jsonify
import swiglpk
import highspy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["*"], "methods": ["GET", "POST", "OPTIONS"]}})



def solve_with_glpk(problem, problem_type):
    lp = swiglpk.glp_create_prob()

    if problem_type.upper() == 'GMPL':
        tran = swiglpk.glp_mpl_alloc_wksp()
        with tempfile.NamedTemporaryFile(mode='w', suffix='.mod', delete=False) as tmp:
            tmp.write(problem)
            tmp_name = tmp.name
        ret = swiglpk.glp_mpl_read_model(tran, tmp_name, 0)
        os.unlink(tmp_name)
        if ret != 0:
            raise ValueError("Error reading GMPL model")
        ret = swiglpk.glp_mpl_generate(tran, None)
        if ret != 0:
            raise ValueError("Error generating GMPL model")
        swiglpk.glp_mpl_build_prob(tran, lp)
    elif problem_type.upper() in ['LP', 'MPS']:
        with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{problem_type.lower()}', delete=False) as tmp:
            tmp.write(problem)
            tmp_name = tmp.name
        if problem_type.upper() == 'LP':
            swiglpk.glp_read_lp(lp, None, tmp_name)
        else:  # MPS
            swiglpk.glp_read_mps(lp, swiglpk.GLP_MPS_FILE, None, tmp_name)
        os.unlink(tmp_name)
    else:
        raise ValueError(f"Unsupported problem type: {problem_type}")

    # Check if the problem is MIP
    num_int = swiglpk.glp_get_num_int(lp)
    print(num_int)
    is_mip = num_int > 0

    if is_mip:
        # Solve MIP
        print("MIPPPPPPP")
        iocp = swiglpk.glp_iocp()
        swiglpk.glp_init_iocp(iocp)
        iocp.presolve = 1
        ret = swiglpk.glp_intopt(lp, iocp)
        if ret != 0:
            raise ValueError(f"GLPK integer optimizer failed with return code {ret}")
        status = swiglpk.glp_mip_status(lp)
        z = swiglpk.glp_mip_obj_val(lp)
    else:
        # Solve LP
        parm = swiglpk.glp_smcp()
        swiglpk.glp_init_smcp(parm)
        ret = swiglpk.glp_simplex(lp, parm)
        if ret != 0:
            raise ValueError(f"GLPK simplex solver failed with return code {ret}")
        status = swiglpk.glp_get_status(lp)
        z = swiglpk.glp_get_obj_val(lp)

    if status != swiglpk.GLP_OPT:
        raise ValueError(f"GLPK failed to find optimal solution. Status: {status}")

    if problem_type.upper() == 'GMPL':
        swiglpk.glp_mpl_free_wksp(tran)
    swiglpk.glp_delete_prob(lp)

    return z

def convert_gmpl_to_lp(problem):
    tran = swiglpk.glp_mpl_alloc_wksp()
    with tempfile.NamedTemporaryFile(mode='w', suffix='.mod', delete=False) as tmp:
        tmp.write(problem)
        tmp_name = tmp.name

    ret = swiglpk.glp_mpl_read_model(tran, tmp_name, 0)
    if ret != 0:
        raise ValueError("Error reading GMPL model")

    ret = swiglpk.glp_mpl_generate(tran, None)
    if ret != 0:
        raise ValueError("Error generating GMPL model")

    lp = swiglpk.glp_create_prob()
    swiglpk.glp_mpl_build_prob(tran, lp)

    with tempfile.NamedTemporaryFile(mode='w', suffix='.lp', delete=False) as tmp:
        tmp_lp_name = tmp.name

    swiglpk.glp_write_lp(lp, None, tmp_lp_name)

    with open(tmp_lp_name, 'r') as f:
        lp_problem = f.read()

    os.unlink(tmp_name)
    os.unlink(tmp_lp_name)
    swiglpk.glp_mpl_free_wksp(tran)
    swiglpk.glp_delete_prob(lp)
    return lp_problem

def solve_with_highs(problem, problem_type):
    h = highspy.Highs()

    if problem_type.upper() == 'GMPL':
        problem = convert_gmpl_to_lp(problem)
        problem_type = 'LP'

    with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{problem_type.lower()}', delete=False) as tmp:
        tmp.write(problem)
        tmp_name = tmp.name

    if problem_type.upper() == 'LP':
        h.readModel(tmp_name)
    elif problem_type.upper() == 'MPS':
        h.readModel(tmp_name)
    else:
        raise ValueError(f"Unsupported problem type for HiGHS: {problem_type}")

    os.unlink(tmp_name)

    h.run()
    return h.getObjectiveValue()

def benchmark_solvers(problem, problem_type, solvers=['glpk', 'highs']):
    results = {}
    for solver in solvers:
        print(f"Running solver: {solver}")
        start_time = time.time()
        try:
            if solver == 'glpk':
                solution = solve_with_glpk(problem, problem_type)
            elif solver == 'highs':
                solution = solve_with_highs(problem, problem_type)
            else:
                raise ValueError(f"Unsupported solver: {solver}")

            end_time = time.time()
            execution_time = end_time - start_time
            results[solver] = {
                'execution_time': execution_time,
                'solution': solution,
                'status': 'success'
            }
        except ValueError as e:
            results[solver] = {
                'execution_time': None,
                'solution': None,
                'status': 'error',
                'error_message': str(e)
            }
        except Exception as e:
            results[solver] = {
                'execution_time': None,
                'solution': None,
                'status': 'unexpected error',
                'error_message': str(e)
            }
    return results

# Standardproblem für GET-Anfragen (GMPL-Format)
DEFAULT_PROBLEM = """
/* decision variables*/
var x1 >= 0;
var x2 >=0;
/* Objective function */ 
maximize label : 4*x1 +5*x2; 
/* Constraints */
subject to label1: x1 + 2*x2 <= 40; 
s.t. label2: 4*x1 + 3*x2 <= 120;
end;
"""
with open("./transportation_mediumgmpl.sec") as f:
    DEFAULT_PROBLEM=""
    for line in f.readlines():
        DEFAULT_PROBLEM+=line

DEFAULT_PROBLEM_TYPE = 'GMPL'

@app.route('/api/benchmark', methods=['GET', 'POST'])
def run_benchmark():
    if request.method == 'POST':
        data = request.json
        problem = data.get('problem', DEFAULT_PROBLEM)
        problem_type = data.get('problem_type', DEFAULT_PROBLEM_TYPE)
    else:  # GET
        problem = DEFAULT_PROBLEM
        problem_type = DEFAULT_PROBLEM_TYPE

    results = benchmark_solvers(problem, problem_type)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)