import { Dispatch, useReducer } from 'react';
import { Program2 } from '../../../Core/Lang/Parser/Program';
import { openFile, saveAsFile, saveFile } from '../../AppWindow';
import { Token } from '../InstructionBlock/Token';
import { ShellAction, ShellState, getShellStateReducer } from './ShellState';

class ShellContext {
    #state: ShellState;
    #dispatch: Dispatch<ShellAction>;

    constructor(state: ShellState, dispatch: Dispatch<ShellAction>) {
        this.#state = state;
        this.#dispatch = dispatch;
    }

    public get canExecute(): boolean { return !!this.program; }

    public get hasError(): boolean { return !!this.console; }

    public get program(): Program2 | undefined { return this.#state.program; }

    public get instructions(): Token[] { return this.#state.instructions; }

    public get console(): string | undefined { return this.#state.console; }

    public get sourceFilepath(): string | undefined { return this.#state.sourceFilepath; }

    public get sourceText(): string { return this.#state.sourceText; }

    public execute(): void {
        this.#dispatch({ action: 'execute' });
    }

    public setInstructions(instructions: Token[]): void {
        this.#dispatch({ action: 'setInstructions', instructions });
    }

    public writeConsole(message: string): void {
        this.#dispatch({ action: 'writeConsole', message });
    }

    public async openFile(): Promise<void> {
        const result = await openFile();
        if (!!result) {
            this.#dispatch({ action: 'open', filepath: result.filepath, sourceText: result.data });
        }
    }

    public async saveFile(): Promise<void> {
        if (!!this.sourceFilepath) {
            await saveFile(this.sourceFilepath, this.sourceText);
        } else {
            this.saveAsFile();
        }
    }

    public async saveAsFile(): Promise<void> {
        const result = await saveAsFile(this.sourceText);
        if (!!result) {
            this.#dispatch({ action: 'save', filepath: result.filepath });
        }
    }

    public setSourceText(sourceText: string): void {
        this.#dispatch({ action: 'setSourceText', sourceText });
    }
}

export function useShellContext(instructions: Token[]): ShellContext {
    const reducer = getShellStateReducer();
    const [state, dispatch] = useReducer(reducer, { instructions, sourceText: '', console: '' });

    return new ShellContext(state, dispatch);
}
