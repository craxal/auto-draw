import { CodeEditor } from '../CodeEditor/CodeEditor';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

export function CodePanel(props: {
    sourceFilepath?: string;
    sourceText: string;
    onSourceTextChange(text: string): void;
    onOpen(): void;
    onSave(): void;
    onSaveAs(): void;
    onExecute(): void;
}): JSX.Element {
    function handleExecuteClick(): void {
        props.onExecute();
    }

    function handleSaveClick(): void {
        props.onSave();
    }

    function handleOpenClick(): void {
        props.onOpen();
    }

    return (
        <div className={'code-panel'}>
            <div className={'code-panel-label'}>
                <Icon name={'Code'} />
                <label htmlFor={'code-panel'}>Code</label>
            </div>
            <div className={'code-panel-buttons'}>
                <IconButton icon={'Play'} onClick={() => handleExecuteClick()} title={'Execute'} />
                <IconButton icon={'FileImport'} onClick={() => handleOpenClick()} title={'Open file'} />
                <IconButton icon={'FileExport'} onClick={() => handleSaveClick()} title={'Save file'} />
            </div>
            <CodeEditor sourceText={props.sourceText} onChange={(text) => props.onSourceTextChange(text)} />
        </div>
    );
}
