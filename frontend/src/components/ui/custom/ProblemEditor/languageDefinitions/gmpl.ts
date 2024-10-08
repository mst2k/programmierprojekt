import { EditorErrorInfo } from "../ProblemEditor";
import { TFunction } from "i18next";

export const GMPLTokens = {
    defaultToken: '',
    tokenPostfix: '.gmpl',
  
    keywords: [
      'set', 'param', 'var', 'maximize', 'minimize', 's.t.', 'subject to', 
      'end', 'data', 'solve', 'check', 'display', 'printf', 'for', 'in'
    ],
  
    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
    ],
  
    symbols:  /[=><!~?:&|+\-*\/\^%]+/,
  
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
    tokenizer: {
      root: [
        [/s\.t\./, 'keyword'],
        [/subject to/, 'keyword'],
        [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword',
                                     '@default': 'identifier' } }],
        { include: '@whitespace' },
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, { cases: { '@operators': 'operator',
                                '@default'  : '' } }],
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],
        [/[;,.]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid' ],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }]
      ],
  
      comment: [
        [/[^\/*]+/, 'comment' ],
        [/\/\*/,    'comment', '@push' ],
        ["\\*/",    'comment', '@pop'  ],
        [/[\/*]/,   'comment' ]
      ],
  
      string: [
        [/[^\\"]+/,  'string'],
        [/@escapes/, 'string.escape'],
        [/\\./,      'string.escape.invalid'],
        [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
      ],
  
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/,       'comment', '@comment' ],
        [/#.*$/,       'comment'],
      ],
    },
  };


  export function checkGMPLErrors(code: string, t: TFunction): EditorErrorInfo {

    const errors: { message: string; line: number }[] = [];
    const lines = code.split('\n');

    const keywordRequiringSemicolon = [
      'set',
      'param',
      'var',
      'subject to',
      'maximize',
      'minimize',
      'solve',
      'display',
      'printf'
  ];
    const validIdentifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    let inDataSection = false;
    let inComment = false;
    let openDeclaration: { keyword: string, line: number } | null = null as { keyword: string, line: number } | null;
    let actualLineNumber = 0;
  
    lines.forEach((line) => {
      actualLineNumber++;
      const trimmedLine = line.trim();
  
      // Skip empty lines and single-line comments
      if (trimmedLine === '' || trimmedLine.startsWith('#')) {
        return;
      }
  
      // Handle multi-line comments
      if (trimmedLine.startsWith('/*')) inComment = true;
      if (trimmedLine.endsWith('*/')) {
        inComment = false;
        return;
      }
      if (inComment) return;
  
      const tokens = tokenizeLine(line);
  
      // Check for data section
      if (tokens.some(token => token.type === 'keyword' && token.value === 'data')) {
        inDataSection = true;
        return;
      }
  
      if (!inDataSection) {

        // Check for declarations without semicolons
        const declarationKeyword = tokens.find(token => keywordRequiringSemicolon.includes(token.value));
        if (declarationKeyword) {
          if (openDeclaration) {
            errors.push({
              message: openDeclaration.keyword + t("editorComponent.errors.gmpl.missingSemilicon"),
              line: openDeclaration.line,
            });
          }
          openDeclaration = { keyword: declarationKeyword.value, line: actualLineNumber };
        }
        if (openDeclaration && tokens.some(token => token.type === 'delimiter' && token.value === ';')) {
          openDeclaration = null;
        }
  
        // Check for restrictions (constraints)
        if (tokens.some(token => token.type === 'keyword' && (token.value === 's.t.' || token.value === 'subject to'))) {
          if (!tokens.some(token => token.type === 'identifier')) {
            errors.push({
              message: t("editorComponent.errors.gmpl.constraintMustHaveName"),
              line: actualLineNumber,
            });
          }
        }
        // Check for invalid identifiers
        tokens.forEach(token => {
          if (token.type === 'identifier' && !validIdentifierRegex.test(token.value)) {
            errors.push({
              message: t("editorComponent.errors.gmpl.invalidIdentifier"),
              line: actualLineNumber,
            });
          }
        });
      } else {
        // Data section checks
        // Add specific checks for data section if needed
      }
    });
  
    // Check if any declaration was left open
    if (openDeclaration) {
      errors.push({
        message: openDeclaration.keyword + " " + t("editorComponent.errors.gmpl.missingSemilicon"),
        line: openDeclaration.line,
      });
    }

    return {
      errors,
    };
  }
  
function tokenizeLine(line: string): { type: string; value: string }[] {
    const tokens: { type: string; value: string }[] = [];
    let remaining = line.trim();
  
    while (remaining.length > 0) {
      let matched = false;
  
      // Check for keywords
      for (const keyword of GMPLTokens.keywords) {
        if (remaining.startsWith(keyword)) {
          tokens.push({ type: 'keyword', value: keyword });
          remaining = remaining.slice(keyword.length).trim();
          matched = true;
          break;
        }
      }
  
      if (matched) continue;
  
      // Check for operators
      for (const operator of GMPLTokens.operators) {
        if (remaining.startsWith(operator)) {
          tokens.push({ type: 'operator', value: operator });
          remaining = remaining.slice(operator.length).trim();
          matched = true;
          break;
        }
      }
  
      if (matched) continue;
  
      // Check for identifiers
      const identifierMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (identifierMatch) {
        tokens.push({ type: 'identifier', value: identifierMatch[0] });
        remaining = remaining.slice(identifierMatch[0].length).trim();
        continue;
      }
  
      // Check for numbers
      const numberMatch = remaining.match(/^\d*\.?\d+([eE][\-+]?\d+)?/);
      if (numberMatch) {
        tokens.push({ type: 'number', value: numberMatch[0] });
        remaining = remaining.slice(numberMatch[0].length).trim();
        continue;
      }
  
      // Check for delimiters
      if ([';', ',', '.'].includes(remaining[0])) {
        tokens.push({ type: 'delimiter', value: remaining[0] });
        remaining = remaining.slice(1).trim();
        continue;
      }
  
      // If we get here, we've encountered an unexpected character
      tokens.push({ type: 'unknown', value: remaining[0] });
      remaining = remaining.slice(1).trim();
    }
  
    return tokens;
  }