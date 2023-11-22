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

    function handleSaveAsClick(): void {
        props.onSaveAs();
    }

    function handleOpenClick(): void {
        props.onOpen();
    }

    return (
        <div className={'code-panel'}>
            <div className={'code-panel-header'}>
                <Icon name={'Code'} />
                <label htmlFor={'code-panel'}>Code</label>
                <div className={'code-panel-buttons'}>
                    <IconButton icon={'File'} onClick={() => handleSaveClick()} title={'Save file'} />
                    <IconButton icon={'FilePen'} onClick={() => handleSaveAsClick()} title={'Save file as'} />
                    <IconButton icon={'FileImport'} onClick={() => handleOpenClick()} title={'Open file'} />
                    <div className={'separator'} />
                    <IconButton icon={'Play'} onClick={() => handleExecuteClick()} title={'Execute'} />
                </div>
            </div>

            <CodeEditor sourceText={props.sourceText} onChange={(text) => props.onSourceTextChange(text)} />
        </div>
    );
}
