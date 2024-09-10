import { useState, useCallback } from 'react';
import GLPK from 'glpk.js';

export function useGLPK(input) {
  const [solution, setSolution] = useState(null);

  const solve = useCallback(async () => {
    const lp = await GLPK();
    const convInput = conv(input, lp);
    console.log(convInput)
    const sol = await lp.solve(convInput);
    console.log(sol)
    setSolution(sol);
  }, [input]);

  useEffect(() => {
    if (input) {
      solve();
    }
  }, [input, solve]);

  return solution;
}

function conv(gmplCode, glpk) {
  const lp = {
    name: 'GMPL Model',
    objective: {
      direction: glpk.GLP_MIN,
      name: 'obj',
      vars: []
    },
    subjectTo: [],
    bounds: [],
    generals: [],
    binaries: [],
    sets: {},
    params: {}
  };

  const lines = gmplCode.split('\n');
  let currentSection = '';
  let objectiveName = '';

  function parseIndexedItem(item) {
    const match = item.match(/(\w+)(?:\{([^}]+)\})?/);
    if (match) {
      return { name: match[1], indices: match[2] ? match[2].split(',').map(s => s.trim()) : [] };
    }
    return { name: item, indices: [] };
  }

  function parseExpression(expr) {
    const terms = expr.split(/([+\-])/);
    let parsedTerms = [];
    let currentSign = 1;

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i].trim();
      if (term === '+') currentSign = 1;
      else if (term === '-') currentSign = -1;
      else if (term) {
        let [coeff, variable] = term.split('*').map(part => part.trim());
        if (!variable) {
          variable = coeff;
          coeff = '1';
        }
        const { name, indices } = parseIndexedItem(variable);
        parsedTerms.push({
          name,
          coef: currentSign * (parseFloat(coeff) || 1),
          indices
        });
      }
    }

    return parsedTerms;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('set')) {
      const setMatch = trimmedLine.match(/set\s+(\w+)(?:\s*{([^}]+)})?\s*;/);
      if (setMatch) {
        const setName = setMatch[1];
        const setIndices = setMatch[2] ? setMatch[2].split(',').map(s => s.trim()) : [];
        lp.sets[setName] = { indices: setIndices, values: [] };
      }
    } else if (trimmedLine.startsWith('param')) {
      const paramMatch = trimmedLine.match(/param\s+(\w+)(?:\s*{([^}]+)})?\s*;/);
      if (paramMatch) {
        const paramName = paramMatch[1];
        const paramIndices = paramMatch[2] ? paramMatch[2].split(',').map(s => s.trim()) : [];
        lp.params[paramName] = { indices: paramIndices, values: {} };
      }
    } else if (trimmedLine.startsWith('var')) {
      const varMatch = trimmedLine.match(/var\s+(\w+)(?:\s*{([^}]+)})?\s*(?:>=\s*(\d+))?/);
      if (varMatch) {
        const varName = varMatch[1];
        const varIndices = varMatch[2] ? varMatch[2].split(',').map(s => s.trim()) : [];
        const lowerBound = varMatch[3] ? parseFloat(varMatch[3]) : 0;
        lp.bounds.push({ name: varName, type: glpk.GLP_LO, lb: lowerBound, ub: 0 });
        if (varIndices.length > 0) {
          lp.generals.push(varName);
        }
      }
    } else if (trimmedLine.startsWith('minimize') || trimmedLine.startsWith('maximize')) {
      currentSection = 'objective';
      const objMatch = trimmedLine.match(/(minimize|maximize)\s+(\w+)\s*:/);
      if (objMatch) {
        objectiveName = objMatch[2];
        lp.objective.direction = objMatch[1] === 'minimize' ? glpk.GLP_MIN : glpk.GLP_MAX;
        lp.objective.name = objectiveName;
      }
    } else if (trimmedLine.startsWith('s.t.')) {
      currentSection = 'constraint';
      const constMatch = trimmedLine.match(/s\.t\.\s+(\w+)(?:\s*{([^}]+)})?\s*:/);
      if (constMatch) {
        const constName = constMatch[1];
        const constIndices = constMatch[2] ? constMatch[2].split(',').map(s => s.trim()) : [];
        lp.subjectTo.push({ name: constName, vars: [], bnds: { type: glpk.GLP_FX, ub: 0, lb: 0 }, indices: constIndices });
      }
    } else if (trimmedLine.startsWith('data;')) {
      currentSection = 'data';
    } else if (currentSection === 'objective' && trimmedLine) {
      lp.objective.vars = parseExpression(trimmedLine);
    } else if (currentSection === 'constraint' && trimmedLine) {
      const parts = trimmedLine.split(/([<>=]+)/);
      if (parts.length === 3) {
        const leftSide = parts[0].trim();
        const operator = parts[1].trim();
        const rightSide = parts[2].trim();
        
        const constraint = lp.subjectTo[lp.subjectTo.length - 1];
        constraint.vars = parseExpression(leftSide);
        
        const boundValue = parseFloat(rightSide);
        if (operator === '<=') {
          constraint.bnds.type = glpk.GLP_UP;
          constraint.bnds.ub = boundValue;
        } else if (operator === '>=') {
          constraint.bnds.type = glpk.GLP_LO;
          constraint.bnds.lb = boundValue;
        } else if (operator === '=') {
          constraint.bnds.type = glpk.GLP_FX;
          constraint.bnds.ub = boundValue;
          constraint.bnds.lb = boundValue;
        }
      }
    } else if (currentSection === 'data') {
      const setMatch = trimmedLine.match(/set\s+(\w+)\s*(?::=|:)\s*(.*?)\s*;/);
      if (setMatch) {
        const setName = setMatch[1];
        const setValues = setMatch[2].split(/\s+/);
        lp.sets[setName].values = setValues;
      }
      const paramMatch = trimmedLine.match(/param\s+(\w+)\s*(?::=|:)\s*(.*?)\s*;/);
      if (paramMatch) {
        const paramName = paramMatch[1];
        const paramValues = paramMatch[2].split(/\s+/);
        if (lp.params[paramName].indices.length === 0) {
          lp.params[paramName].values = parseFloat(paramValues[0]);
        } else {
          for (let i = 0; i < paramValues.length; i += lp.params[paramName].indices.length + 1) {
            const indices = paramValues.slice(i, i + lp.params[paramName].indices.length);
            const value = parseFloat(paramValues[i + lp.params[paramName].indices.length]);
            lp.params[paramName].values[indices.join(',')] = value;
          }
        }
      }
    }
  }

  // Set default bounds for variables if not specified
  for (const bound of lp.bounds) {
    if (bound.type === glpk.GLP_LO && bound.lb === 0) {
      bound.type = glpk.GLP_FR;
    }
  }

  return lp;
}