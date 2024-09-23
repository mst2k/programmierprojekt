import { EditorLanguage, ErrorCheckFunction, EditorErrorInfo } from "../ProblemEditor";


export const LPTokens: EditorLanguage = {
  defaultToken: '',
  tokenPostfix: '.lp',

  ignoreCase:true,

  keywords: [
    'minimize', 'maximize', 'minimum', 'maximum', 'min', 'max',
    'subject to', 'such that', 'st', 's.t.',
    'bounds', 'binary', 'binaries', 'bin', 'general', 'generals', 'gen',
    'semi-continuous', 'semis', 'semi', 'sos', 'pwlobj',
    'lazy constraints', 'user cuts', 'free', 'infinity', 'inf',
    'general constraints', 'general constraint', 'gencons', 'g.c.',
    'end', 'multi-objectives'
  ],

  typeKeywords: [
    'S1', 'S2', 'MIN', 'MAX', 'OR', 'AND', 'NORM', 'ABS', 'PWL',
    'POLY', 'POW', 'EXP', 'EXPA', 'LOG', 'LOG_A', 'LOGISTIC', 'SIN', 'COS', 'TAN'
  ],

  operators: [
    '=', '<=', '>=', '<', '>', '->', '+', '-', '*', '/', '^'
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
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
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+/, 'number'],
      [/[;,:]/, 'delimiter'],
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }]
    ],

    comment: [
      [/[^\*\\]+/, 'comment'],
      [/\\$/, 'comment'],
      [/\\/, 'comment'],
      [/\*\\/, 'comment'],
      [/\*/, 'comment', '@pop']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\\/, 'comment', '@comment'],
      [/\\\s*$/, 'comment'],
    ],
  },
};

export const checkLPErrors: ErrorCheckFunction = (code: string): EditorErrorInfo => {
  const errors: { message: string; line: number }[] = [];
  const lines = code.split('\n');

  let inObjectiveSection = false;
  let inConstraintSection = false;
  let hasObjective = false;
  let hasRestrictions = false;
  let hasNonNegativity = false;
  let actualLineNumber = 0;

  lines.forEach((line) => {
    actualLineNumber++;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('\\')) {
      return;
    }

    // Check for sections
    if (trimmedLine.match(/^(minimize|maximize|minimum|maximum|min|max)/i)) {
      inObjectiveSection = true;
      inConstraintSection = false;
      inBoundsSection = false;
      hasObjective = true;
      return;
    }

    if (trimmedLine.match(/^(subject to|such that|st|s\.t\.)/i)) {
      inObjectiveSection = false;
      inConstraintSection = true;
      inBoundsSection = false;
      return;
    }

    if (trimmedLine.match(/^bounds/i)) {
      inObjectiveSection = false;
      inConstraintSection = false;
      inBoundsSection = true;
      return;
    }

    // Check for specific errors in each section
    if (inObjectiveSection) {
      // Add objective-specific checks here
    }

    if (inConstraintSection) {
      if (!trimmedLine.includes('<=') && !trimmedLine.includes('>=') && !trimmedLine.includes('=')) {
        errors.push({
          message: 'Constraint must include a comparison operator (<=, >=, or =)',
          line: actualLineNumber,
        });
      }
      hasRestrictions = true;
    }

    // if (inBoundsSection) {
    //   if (!trimmedLine.includes('<=') && !trimmedLine.includes('>=') && !trimmedLine.includes('=') && !trimmedLine.includes('free')) {
    //     errors.push({
    //       message: 'Bound must include a comparison operator (<=, >=, =) or "free"',
    //       line: actualLineNumber,
    //     });
    //   }
    //   if (trimmedLine.includes('>= 0') || trimmedLine.toLowerCase().includes('&gt;= 0')) {
    //     hasNonNegativity = true;
    //   }
    // }
  });

  if (!hasObjective) {
    errors.push({
      message: 'LP file must include an objective function (minimize or maximize)',
      line: 1,
    });
  }

  return {
    errors,
    hasObjective,
    hasRestrictions,
    hasNonNegativity
  };
};