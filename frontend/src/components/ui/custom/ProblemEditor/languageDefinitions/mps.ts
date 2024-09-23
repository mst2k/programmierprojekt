import { EditorLanguage, ErrorCheckFunction, EditorErrorInfo } from "../ProblemEditor";

export const MPSTokens: EditorLanguage = {
  defaultToken: '',
  tokenPostfix: '.mps',

  ignoreCase: true,

  keywords: [
    'NAME', 'OBJSENSE', 'ROWS', 'COLUMNS', 'RHS', 'RANGES', 'BOUNDS',
    'QUADOBJ', 'QCMATRIX', 'INDICATORS', 'ENDATA', 'LAZYCONS', 'USERCUTS',
    'PWLOBJ', 'SOS', 'GENCONS', 'SCENARIOS'
  ],

  typeKeywords: [
    'N', 'L', 'G', 'E', 'MAX', 'MIN',
    'LO', 'UP', 'FX', 'FR', 'MI', 'PL', 'BV', 'LI', 'UI', 'SC', 'SI',
    'S1', 'S2', 'IF', 'MIN', 'MAX', 'OR', 'AND', 'NORM', 'ABS', 'PWL',
    'POLY', 'POW', 'EXP', 'EXPA', 'LOG', 'LOGA', 'LOGISTIC', 'SIN', 'COS', 'TAN'
  ],

  operators: [
    '=', '<=', '>=', '<', '>', '->', '+', '-', '*', '/', '^'
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  tokenizer: {
    root: [
      [/^[*].*$/, 'comment'],
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@default': 'identifier'
        }
      }],
      { include: '@whitespace' },
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
      [/'MARKER'/, 'string'],
      [/'INTORG'/, 'string'],
      [/'INTEND'/, 'string'],
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+/, 'number'],
      [/[;,:]/, 'delimiter'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
};

export const checkMPSErrors: ErrorCheckFunction = (code: string): EditorErrorInfo => {
  const errors: { message: string; line: number }[] = [];
  const lines = code.split('\n');

  let hasName = false;
  let hasRows = false;
  let hasColumns = false;
  let hasRHS = false;
  let hasEndata = false;
  let currentSection = '';
  let actualLineNumber = 0;

  lines.forEach((line) => {
    actualLineNumber++;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('*')) {
      return;
    }

    // Check for sections
    if (trimmedLine.startsWith('NAME')) {
      hasName = true;
      currentSection = 'NAME';
    } else if (trimmedLine === 'ROWS') {
      hasRows = true;
      currentSection = 'ROWS';
    } else if (trimmedLine === 'COLUMNS') {
      hasColumns = true;
      currentSection = 'COLUMNS';
    } else if (trimmedLine === 'RHS') {
      hasRHS = true;
      currentSection = 'RHS';
    } else if (trimmedLine === 'ENDATA') {
      hasEndata = true;
    } else {
      // Check for specific errors in each section
      switch (currentSection) {
        case 'ROWS':
          if (!['N', 'L', 'G', 'E'].includes(trimmedLine[0])) {
            errors.push({
              message: 'Invalid row type. Must be N, L, G, or E.',
              line: actualLineNumber,
            });
          }
          break;
        case 'COLUMNS':
          // Add column-specific checks here if needed
          break;
        case 'RHS':
          // Add RHS-specific checks here if needed
          break;
      }
    }
  });

  if (!hasName) {
    errors.push({
      message: 'MPS file must start with a NAME section',
      line: 1,
    });
  }

  if (!hasRows) {
    errors.push({
      message: 'MPS file must include a ROWS section',
      line: 1,
    });
  }

  if (!hasColumns) {
    errors.push({
      message: 'MPS file must include a COLUMNS section',
      line: 1,
    });
  }

  if (!hasRHS) {
    errors.push({
      message: 'MPS file must include an RHS section',
      line: 1,
    });
  }

  if (!hasEndata) {
    errors.push({
      message: 'MPS file must end with an ENDATA statement',
      line: lines.length,
    });
  }

  return {
    errors,
    hasObjective: true, // MPS always has an objective (N row in ROWS section)
    hasRestrictions: hasRows, // If it has a ROWS section, it has restrictions
    hasNonNegativity: true, // MPS assumes non-negativity by default
  };
};