import { Reducer } from 'react';
import { Interpreter2 } from '../../../Core/Lang/Interpreter/Interpreter';
import { Scanner } from '../../../Core/Lang/Lexical/Scanner';
import { Parser as Parser2 } from '../../../Core/Lang/Parser/Parser';
import { Program2 } from '../../../Core/Lang/Parser/Program';
import { Resolver } from '../../../Core/Lang/Resolver/Resolver';
import { Token } from '../InstructionBlock/Token';

export type ShellState = {
    instructions: Token[];
    sourceFilepath?: string;
    sourceText: string;
    program?: Program2;
    console: string;
};

export type ShellAction =
    | { action: 'execute'; }
    | { action: 'setInstructions'; instructions: Token[]; }
    | { action: 'writeConsole'; message: string; }
    | { action: 'setSourceText'; sourceText: string; }
    | { action: 'open'; filepath: string; sourceText: string; }
    | { action: 'save'; filepath: string; }
    ;

export function getShellStateReducer(): Reducer<ShellState, ShellAction> {
    function reduceShellState(state: ShellState, message: ShellAction): ShellState {
        // function handleExecute(): ShellState {
        //     const parseResult = new Parser(state.instructions).parse();
        //     if (parseResult.type === 'error') {
        //         return {
        //             ...state,
        //             console: `Parse error on line ${parseResult.error.token.line + 1}: ${parseResult.error.message}\n`,
        //         };
        //     }

        //     //  Do a "dry" run without actual rendering to find semantic errors.
        //     const interpreterResult = new Interpreter().visitProgram(parseResult.result);
        //     if (interpreterResult.type === 'error') {
        //         return {
        //             ...state,
        //             console: `Execution error: ${interpreterResult.error.message}\n`,
        //         };
        //     }

        //     return {
        //         ...state,
        //         program: parseResult.result,
        //         console: '',
        //     };
        // }

        function handleExecute2(): ShellState {
            const tokens = new Scanner(state.sourceText).scan();
            const parseResult = new Parser2(tokens).parse();
            if (parseResult.type === 'error') {
                const message = parseResult.error
                    .map((err) => `${state.sourceFilepath}:${err.token.line}:${err.token.char} > [ERROR] ${err.message}`)
                    .join('\n');

                return { ...state, console: message };
            }

            const interpreter = new Interpreter2();
            const resolverResult = new Resolver(interpreter).resolve(parseResult.result);
            if (resolverResult.type === 'error') {
                const message = resolverResult.error
                    .map((err) => `${state.sourceFilepath}:${err.token.line}:${err.token.char} > [ERROR] ${err.message}`)
                    .join('\n');

                return { ...state, console: message };
            }

            //  Do a "dry" run without actually rendering to get console output and errors.
            const interpreterResult = interpreter.interpret(parseResult.result);
            if (interpreterResult.type === 'error') {
                const message = `${state.sourceFilepath}:${interpreterResult.error.token.line}:${interpreterResult.error.token.char} > [ERROR] ${interpreterResult.error.message}`;

                return { ...state, console: message };
            }

            return {
                ...state,
                program: parseResult.result,
                console: interpreter.console.join('\n'),
            };
        }

        function handleOpen(filepath: string, data: string): ShellState {
            return { ...state, sourceFilepath: filepath, sourceText: data };
        }

        function handleSave(filepath: string): ShellState {
            return { ...state, sourceFilepath: filepath };
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

        function handleSetSourceText(sourceText: string): ShellState {
            return { ...state, sourceText };
        }

        switch (message.action) {
            case 'execute': return handleExecute2();
            case 'open': return handleOpen(message.filepath, message.sourceText);
            case 'save': return handleSave(message.filepath);
            case 'setInstructions': return handleSetInstructions(message.instructions);
            case 'writeConsole': return handleWriteConsole(message.message);
            case 'setSourceText': return handleSetSourceText(message.sourceText);
        }
    }

    return reduceShellState;
}
