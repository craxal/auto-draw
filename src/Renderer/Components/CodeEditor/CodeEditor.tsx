import type * as monaco from 'monaco-editor';

import { useEffect, useRef } from 'react';

export function CodeEditor(props: {
    sourceText: string;
    onChange(text: string): void;
}): JSX.Element {
    const containerElementRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const subscriptionRef = useRef<monaco.IDisposable | null>(null);
    const preventTriggerChangeEvent = useRef<boolean | null>(null);

    useEffect(() => {
        if (!!containerElementRef.current) {
            const options: monaco.editor.IStandaloneEditorConstructionOptions = {
                value: props.sourceText,
                theme: 'vs-dark',
                language: 'autodraw',
                minimap: { enabled: false }
            };
            const editor = window.app.monaco.editor.create(containerElementRef.current, {
                ...options,
                'bracketPairColorization.enabled': false,
            } as any);

            editorRef.current = editor;
            subscriptionRef.current = editor.onDidChangeModelContent((_event) => {
                if (!preventTriggerChangeEvent.current) {
                    props.onChange(editor.getValue());
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!!editorRef.current) {
            if (props.sourceText === editorRef.current.getValue()) {
                return;
            }

            const model = editorRef.current.getModel();
            preventTriggerChangeEvent.current = true;
            editorRef.current.pushUndoStop();
            if (!!model) {
                // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
                model.pushEditOperations(
                    [],
                    [{ range: model.getFullModelRange(), text: props.sourceText }],
                    () => [],
                );
            }
            editorRef.current.pushUndoStop();
            preventTriggerChangeEvent.current = false;
        }
    }, [props.sourceText]);

    return (<div className={'code-panel-editor'} ref={containerElementRef}></div>);
}
