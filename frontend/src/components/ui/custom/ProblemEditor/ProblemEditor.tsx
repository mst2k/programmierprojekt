import React from 'react';
import { Editor } from "@monaco-editor/react";

import { ProblemFormats } from '@/interfaces/SolverConstants';
import { checkGMPLErrors, GMPLTokens } from './languageDefinitions/gmpl';
import { checkLPErrors, LPTokens } from './languageDefinitions/lp';


export interface EditorLanguage {
  // Define the structure of your language definition here
  // This is a placeholder and should be filled with actual properties
}

export interface ErrorCheckFunction {
  (code: string): { message: string; line: number }[];
}

interface ProblemEditorProps {
    problemFormat: ProblemFormats;
    value: string;
    onChange: (value: string | undefined) => void;
}

const formatConfigs: Record<ProblemFormats, { tokens: EditorLanguage; checkErrors: ErrorCheckFunction }> = {
    'GMPL': { tokens: GMPLTokens, checkErrors: checkGMPLErrors },
    'LP': { tokens: LPTokens, checkErrors: checkLPErrors },
    'MPS': { tokens: {}, checkErrors: () => [] },
};

export const ProblemEditor: React.FC<ProblemEditorProps> = (props) => {
    const { tokens, checkErrors } = formatConfigs[props.problemFormat];

    const handleEditorWillMount = (monaco: any) => {
        monaco.languages.register({ id: props.problemFormat });
        monaco.languages.setMonarchTokensProvider(props.problemFormat, tokens);
    };
   
    const handleEditorDidMount = (editor: any, monaco: any) => {
        const updateErrors = () => {
            const code = editor.getValue();
            const errors = checkErrors(code);
            const model = editor.getModel();
        
            monaco.editor.setModelMarkers(model, props.problemFormat, errors.map(err => ({
                severity: monaco.MarkerSeverity.Error,
                message: err.message,
                startLineNumber: err.line,
                startColumn: 1,
                endLineNumber: err.line,
                endColumn: model.getLineMaxColumn(err.line),
            })));
        };

        editor.onDidChangeModelContent(updateErrors);
        updateErrors(); // Initial error check
    };
   
    return (
        <Editor
            onMount={handleEditorDidMount}
            defaultLanguage={props.problemFormat}
            value={props.value}
            onChange={props.onChange}
            beforeMount={handleEditorWillMount}
        />
    );
};