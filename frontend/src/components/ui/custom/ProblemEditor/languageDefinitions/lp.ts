export const LPTokens = {

  };

  export function checkLPErrors(code: string): { message: string; line: number }[] {
    const errors: { message: string; line: number }[] = [];
    const lines = code.split('\n');
  
    lines.forEach((line, index) => {
      if (line.trim().startsWith('set') && !line.includes(';')) {
        errors.push({
          message: 'Set declaration must end with a semicolon',
          line: index + 1,
        });
      }
      // Add more GMPL-specific checks here
    });
  
    return errors;
  }