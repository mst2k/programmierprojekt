import React, { useCallback, useEffect, useRef } from 'react';
import { Editor, useMonaco } from "@monaco-editor/react";
import { ProblemFormats } from '@/interfaces/SolverConstants';
import { checkGMPLErrors, GMPLTokens } from './languageDefinitions/gmpl';
import { checkLPErrors, LPTokens } from './languageDefinitions/lp';
import { checkMPSErrors, MPSTokens } from './languageDefinitions/mps';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import {useTheme} from "@/hooks/themeProvider.tsx";


export interface EditorLanguage {}

export interface EditorErrorInfo {
  errors: { message: string; line: number }[];
}

export interface ErrorCheckFunction {
  (code: string, t: TFunction): EditorErrorInfo;
}

interface ProblemEditorProps {
  problemFormat: ProblemFormats;
  value: string;
  onChange: (value: string) => void;
}

const formatConfigs: Record<ProblemFormats, { tokens: EditorLanguage; checkErrors: (code: string, t: TFunction) => EditorErrorInfo }> = {
  'GMPL': { tokens: GMPLTokens, checkErrors: checkGMPLErrors },
  'LP': { tokens: LPTokens, checkErrors: checkLPErrors },
  'MPS': { tokens: MPSTokens, checkErrors: checkMPSErrors },
};

export const ProblemEditor: React.FC<ProblemEditorProps> = (props) => {

  const { tokens, checkErrors } = formatConfigs[props.problemFormat];
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const { t, i18n } = useTranslation();
  const { theme: colorTheme,  } = useTheme();

  const MARKER_OWNER = 'problem-editor-markers';

  const clearMarkers = useCallback((editor: any, monaco: any) => {
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, MARKER_OWNER, []);
  }, []);

  const updateErrors = useCallback((code: string, editor: any, monaco: any) => {
    if (!code) {
      clearMarkers(editor, monaco);
      return;
    }

    const { errors } = checkErrors(code, t);
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, MARKER_OWNER, errors.map(err => ({
      severity: monaco.MarkerSeverity.Error,
      message: err.message,
      startLineNumber: err.line,
      startColumn: 1,
      endLineNumber: err.line,
      endColumn: model.getLineMaxColumn(err.line),
    })));
  }, [checkErrors, t, clearMarkers]);

  useEffect(() => {
    if (monaco && editorRef.current) {
      const editor = editorRef.current;
      const code = editor.getValue();
      updateErrors(code, editorRef.current, monaco);
    }
  }, [monaco, updateErrors, i18n.language]);


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setupLanguage(monaco);

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      updateErrors(code, editor, monaco);
    });

    const code = editor.getValue();
    updateErrors(code, editor, monaco);
  };

  const setupLanguage = useCallback((monaco: any) => {
    if (monaco) {
      monaco.languages.register({ id: props.problemFormat });
      monaco.languages.setMonarchTokensProvider(props.problemFormat, tokens);
    }
  }, [props.problemFormat, tokens]);

  useEffect(() => {
    if (monaco && editorRef.current) {
      setupLanguage(monaco);
      const model = editorRef.current.getModel();
      monaco.editor.setModelLanguage(model, props.problemFormat);

      clearMarkers(editorRef.current, monaco);

      const code = editorRef.current.getValue();
      updateErrors(code, editorRef.current, monaco);
    }
  }, [props.problemFormat, monaco, props.value, setupLanguage, clearMarkers, updateErrors]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <Editor
          onMount={handleEditorDidMount}
          defaultLanguage={props.problemFormat}
          theme={colorTheme==="dark" || colorTheme==="system" ? "vs-dark": "vs-light"}
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
    </div>
  );
};