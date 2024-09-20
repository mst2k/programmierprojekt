import React, { useEffect, useRef, useState } from 'react';
import { Editor, useMonaco } from "@monaco-editor/react";
import { ProblemFormats } from '@/interfaces/SolverConstants';
import { checkGMPLErrors, GMPLTokens } from './languageDefinitions/gmpl';
import { checkLPErrors, LPTokens } from './languageDefinitions/lp';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'
import { checkMPSErrors, MPSTokens } from './languageDefinitions/mps';

export interface EditorLanguage {
  // TODO: Define the language tokens, erst wenn ich die Tokens von LP und GMPL verglichen habe
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
  'LP': { tokens: LPTokens, checkErrors: checkLPErrors },
  'MPS': { tokens: MPSTokens, checkErrors: checkMPSErrors },
};

export const ProblemEditor: React.FC<ProblemEditorProps> = (props) => {
  const { tokens, checkErrors } = formatConfigs[props.problemFormat];
  const [modelProperties, setModelProperties] = useState({
    hasObjective: false,
    hasRestrictions: false,
    hasNonNegativity: false
  });
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();

  const setupLanguage = (monaco: any) => {
    if (monaco) {
      monaco.languages.register({ id: props.problemFormat });
      monaco.languages.setMonarchTokensProvider(props.problemFormat, tokens);
    }
  };

  const MARKER_OWNER = 'problem-editor-markers';

  const clearMarkers = (editor: any, monaco: any) => {
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, MARKER_OWNER, []);
  };

  useEffect(() => {
    if (monaco && editorRef.current) {
      setupLanguage(monaco);
      const model = editorRef.current.getModel();
      monaco.editor.setModelLanguage(model, props.problemFormat);
      
      // Clear existing markers before applying new ones
      clearMarkers(editorRef.current, monaco);
      
      const code = editorRef.current.getValue();
      updateErrors(code, editorRef.current, monaco);
    }
  }, [props.problemFormat, monaco, props.value]);

  const updateErrors = (code: string, editor: any, monaco: any) => {

    //wenn kein code vorhanden ist, keine Fehler anzeigen
    if (!code) {
      setModelProperties({
        hasObjective: false,
        hasRestrictions: false,
        hasNonNegativity: false
      });
      return;
    }

    const { errors, hasObjective, hasRestrictions, hasNonNegativity } = checkErrors(code);
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, MARKER_OWNER, errors.map(err => ({
      severity: monaco.MarkerSeverity.Error,
      message: err.message,
      startLineNumber: err.line,
      startColumn: 1,
      endLineNumber: err.line,
      endColumn: model.getLineMaxColumn(err.line),
    })));
    setModelProperties({ hasObjective, hasRestrictions, hasNonNegativity });
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {

    clearMarkers(editor, monaco);

    editorRef.current = editor;
    setupLanguage(monaco);
    
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      updateErrors(code, editor, monaco);
    });
    
    const code = editor.getValue();
    updateErrors(code, editor, monaco);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <Editor
          onMount={handleEditorDidMount}
          defaultLanguage={props.problemFormat}
          value={props.value}
          onChange={(value) => props.onChange(value || '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderLineHighlight: "none"
          }}
        />
      </div>
      <div className='flex justify-around mt-2'>
        {/* TODO: loopen, wenn ich übersetzungen mache */}
        <p className='flex items-center gap-2'>Has Objective: {modelProperties.hasObjective ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
        <p className='flex items-center gap-2'>Has Restrictions: {modelProperties.hasRestrictions ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
        <p className='flex items-center gap-2'>Has Non-Negativity: {modelProperties.hasNonNegativity ? <CheckIcon className="text-green-500" /> : <Cross1Icon className="text-red-500" />}</p>
      </div>
    </div>
  );
};