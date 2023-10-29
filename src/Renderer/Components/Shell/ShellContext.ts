import { Dispatch, useReducer } from 'react';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { Program } from '../../../Core/Lang/Parser/Program';
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

    public get program(): Program | undefined { return this.#state.program; }

    public get instructions(): Token[] { return this.#state.instructions; }

    public get console(): string | undefined { return this.#state.console; }

    public parseInstructions(): void {
        this.#dispatch({ action: 'execute' });
    }

    public setInstructions(instructions: Token[]): void {
        this.#dispatch({ action: 'setInstructions', instructions });
    }

    public writeConsole(message: string): void {
        this.#dispatch({ action: 'writeConsole', message });
    }
}

export function useShellContext(instructions: Token[]): ShellContext {
    const reducer = getShellStateReducer();
    const [state, dispatch] = useReducer(reducer, { instructions, console: '' });

    return new ShellContext(state, dispatch);
}
