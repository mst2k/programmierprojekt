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
    console.log("Editor mounted");
    const updateErrors = () => {
      const code = editor.getValue();
      const { errors, hasObjective, hasRestrictions, hasNonNegativity } = checkErrors(code);
      const model = editor.getModel();
      console.log("errors", errors);
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
    console.log("errorcheck")
    editor.onDidChangeModelContent(updateErrors);
    updateErrors(); // Initial error check
  };
 
  return (
    <>
      <Editor
        onMount={handleEditorDidMount}
        height="60vh"
        defaultLanguage={props.problemFormat}
        value={props.value}
        onChange={(value) => props.onChange(value || '')}
        beforeMount={handleEditorWillMount}
      />
      <div className='flex justify-around'>
        {/*Hier sollten man eigentlich drüber iterieren, aber ich habe keine Lust wegen den Übersetzungen - vielleicht später :))*/}
        <p className='flex items-center gap-2'>Has Objective: {modelProperties.hasObjective ? <CheckIcon color='green' /> : <Cross1Icon color='red' />}</p>
        <p className='flex items-center gap-2'>Has Restrictions: {modelProperties.hasRestrictions ? <CheckIcon color='green' /> : <Cross1Icon color='red' />}</p>
        <p className='flex items-center gap-2'>Has Non-Negativity: {modelProperties.hasNonNegativity ? <CheckIcon color='green' /> : <Cross1Icon color='red' />}</p>
      </div>
    </>
  );
};