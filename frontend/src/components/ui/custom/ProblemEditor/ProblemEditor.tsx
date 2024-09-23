import React, { useState } from 'react';
import { Editor } from "@monaco-editor/react";
import { ProblemFormats } from '@/interfaces/SolverConstants';
import { checkGMPLErrors, GMPLTokens } from './languageDefinitions/gmpl';
import { checkLPErrors, LPTokens } from './languageDefinitions/lp';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'

export interface EditorLanguage {
  // Define the structure of your language definition here
  // This is a placeholder and should be filled with actual properties
}

export interface EditorErrorInfo {
  errors: { message: string; line: number }[];
  hasObjective: boolean;
  hasRestrictions: boolean;
  hasNonNegativity: boolean;
}

export interface ErrorCheckFunction {
  (code: string): EditorErrorInfo;
}

interface ProblemEditorProps {
  problemFormat: ProblemFormats;
  value: string;
  onChange: (value: string) => void;
}

const formatConfigs: Record<ProblemFormats, { tokens: EditorLanguage; checkErrors: ErrorCheckFunction }> = {
  'GMPL': { tokens: GMPLTokens, checkErrors: checkGMPLErrors },
  'LP': { 
    tokens: LPTokens, 
    checkErrors: (code: string) => ({ 
      errors: checkLPErrors(code),
      hasObjective: false,
      hasRestrictions: false,
      hasNonNegativity: false
    })
  },
  'MPS': { 
    tokens: {}, 
    checkErrors: () => ({
      errors: [],
      hasObjective: false,
      hasRestrictions: false,
      hasNonNegativity: false
    })
  },
};

export const ProblemEditor: React.FC<ProblemEditorProps> = (props) => {
  const { tokens, checkErrors } = formatConfigs[props.problemFormat];
  const [modelProperties, setModelProperties] = useState({
    hasObjective: false,
    hasRestrictions: false,
    hasNonNegativity: false
  });

  const handleEditorWillMount = (monaco: any) => {
    monaco.languages.register({ id: props.problemFormat });
    monaco.languages.setMonarchTokensProvider(props.problemFormat, tokens);
  };
 
  const handleEditorDidMount = (editor: any, monaco: any) => {
    const updateErrors = () => {
      const code = editor.getValue();
      const { errors, hasObjective, hasRestrictions, hasNonNegativity } = checkErrors(code);
      const model = editor.getModel();
      monaco.editor.setModelMarkers(model, props.problemFormat, errors.map(err => ({
        severity: monaco.MarkerSeverity.Error,
        message: err.message,
        startLineNumber: err.line,
        startColumn: 1,
        endLineNumber: err.line,
        endColumn: model.getLineMaxColumn(err.line),
      })));
      setModelProperties({ hasObjective, hasRestrictions, hasNonNegativity });
    };
    editor.onDidChangeModelContent(updateErrors);
    updateErrors(); // Initial error check
  };
 
  return (
    <div className="flex flex-col h-full">
        <div className="flex-grow">
      <Editor
        onMount={handleEditorDidMount}
        defaultLanguage={props.problemFormat}
        value={props.value}
        onChange={(value) => props.onChange(value || '')}
        beforeMount={handleEditorWillMount}
        options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderLineHighlight: "none"
          }}
          
      />
      </div>
      {/*<div className='flex justify-around mt-2'>
        Hier sollten man eigentlich drüber iterieren, aber ich habe keine Lust wegen den Übersetzungen - vielleicht später :))
        <p className='flex items-center gap-2'>Has Objective: {modelProperties.hasObjective ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
        <p className='flex items-center gap-2'>Has Restrictions: {modelProperties.hasRestrictions ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
        <p className='flex items-center gap-2'>Has Non-Negativity: {modelProperties.hasNonNegativity ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
      </div>*/}
    </div>
  );
};