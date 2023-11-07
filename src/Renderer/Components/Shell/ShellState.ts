import { Reducer } from 'react';
import { Interpreter } from '../../../Core/Lang/Interpreter/Interpreter';
import { Scanner } from '../../../Core/Lang/Lexical/Scanner';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { Parser } from '../../../Core/Lang/Parser/Parser';
import { Program } from '../../../Core/Lang/Parser/Program';
import { Parser as Parser2 } from '../../../Core/Lang/Parser2/Parser2';

export type ShellState = {
    instructions: Token[];
    sourceFilepath: string;
    sourceText: string;
    program?: Program;
    console: string;
};

export type ShellAction =
    | { action: 'execute'; }
    | { action: 'setInstructions', instructions: Token[]; }
    | { action: 'writeConsole', message: string; }
    ;

export function getShellStateReducer(): Reducer<ShellState, ShellAction> {
    function reduceShellState(state: ShellState, message: ShellAction): ShellState {
        function handleExecute(): ShellState {
            const parseResult = new Parser(state.instructions).parse();
            if (parseResult.type === 'error') {
                return {
                    ...state,
                    console: `Parse error on line ${parseResult.error.token.line + 1}: ${parseResult.error.message}\n`,
                };
            }

            //  Do a "dry" run without actual rendering to find semantic errors.
            const interpreterResult = new Interpreter().visitProgram(parseResult.result);
            if (interpreterResult.type === 'error') {
                return {
                    ...state,
                    console: `Execution error: ${interpreterResult.error.message}\n`,
                };
            }

            return {
                ...state,
                program: parseResult.result,
                console: '',
            };
        }

        function handleExecute2(): ShellState {
            const tokens = new Scanner(state.sourceText).scan();
            const parseResult = new Parser2(tokens).parse();
            if (parseResult.type === 'error') {
                return {
                    ...state,
                    console: `${filepath}:${err.token.line}:${err.token.char} > [ERROR] ${err.message}\n`,
                };
            }

            //  Do a "dry" run without actual rendering to find semantic errors.
            const interpreterResult = new Interpreter().visitProgram(parseResult.result);
            if (interpreterResult.type === 'error') {
                return {
                    ...state,
                    console: `Execution error: ${interpreterResult.error.message}\n`,
                };
            }

            return {
                ...state,
                program: parseResult.result,
                console: '',
            };
        }

        function handleSetInstructions(instructions: Token[]): ShellState {
            const lineCorrectInstructions = instructions.map((i, index) => ({ ...i, line: index }));
            if (lineCorrectInstructions.at(-1)?.type !== 'endProgram') {
                return { ...state, instructions: [...lineCorrectInstructions, { type: 'endProgram', line: lineCorrectInstructions.length }] };
            } else {
                return { ...state, instructions: lineCorrectInstructions };
            }
        }

        function handleWriteConsole(message: string): ShellState {
            return { ...state, console: state.console + `${message}\n` };
        }

        switch (message.action) {
            case 'execute': return handleExecute2();
            case 'setInstructions': return handleSetInstructions(message.instructions);
            case 'writeConsole': return handleWriteConsole(message.message);
        }
    }

    return reduceShellState;
}