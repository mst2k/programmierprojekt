import React from 'react';
import { gmplLanguage } from './gmpl';
import Editor from '@monaco-editor/react';

interface GMPLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

function checkGMPLErrors(code: string): { message: string; line: number }[] {
    const errors: { message: string; line: number }[] = [];
    const lines = code.split('\n');
  
    lines.forEach((line, index) => {
      if (line.trim().startsWith('set') && !line.includes(';')) {
        errors.push({
          message: 'Set declaration must end with a semicolon',
          line: index + 1,
        });
      }
      // Fügen Sie hier weitere Überprüfungen hinzu
    });
  
    return errors;
  }

export const GMPLEditor: React.FC<GMPLEditorProps> = ({ value, onChange }) => {
  const handleEditorWillMount = (monaco: any) => {
    monaco.languages.register({ id: 'gmpl' });
    monaco.languages.setMonarchTokensProvider('gmpl', gmplLanguage);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    const updateErrors = () => {
      const errors = checkGMPLErrors(editor.getValue());
      const model = editor.getModel();
      monaco.editor.setModelMarkers(model, 'gmpl', errors.map(err => ({
        severity: monaco.MarkerSeverity.Error,
        message: err.message,
        startLineNumber: err.line,
        startColumn: 1,
        endLineNumber: err.line,
        endColumn: model.getLineMaxColumn(err.line),
      })));
    };

    editor.onDidChangeModelContent(updateErrors);
    updateErrors();
  };

  return (
    <Editor
      onMount={handleEditorDidMount}
      height="500px"
      defaultLanguage="gmpl"
      value={value}
      onChange={onChange}
      beforeMount={handleEditorWillMount}
    />
  );
};