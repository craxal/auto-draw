import { Reducer } from "react";
import { Interpreter } from "../../../Core/Lang/Interpreter/Interpreter";
import { Token } from "../../../Core/Lang/Lexical/Token";
import { Parser } from "../../../Core/Lang/Parser/Parser";
import { Program } from "../../../Core/Lang/Parser/Program";

export type ShellState = {
    instructions: Token[];
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
                    console: state.console + `Parse error on line ${parseResult.error.token.line + 1}: ${parseResult.error.message}\n`
                };
            }

            //  Do a "dry" run without actual rendering to find semantic errors.
            const interpreterResult = new Interpreter().visitProgram(parseResult.result);
            if (interpreterResult.type === 'error') {
                return {
                    ...state,
                    console: state.console + `Execution error: ${interpreterResult.error.message}\n`
                };
            }

            return {
                ...state,
                program: parseResult.result
            };
        }

        function handleSetInstructions(instructions: Token[]): ShellState {
            return { ...state, instructions: instructions.map((i, index) => ({ ...i, line: index })) };
        }

        function handleWriteConsole(message: string): ShellState {
            return { ...state, console: state.console + `${message}\n` };
        }

        switch (message.action) {
            case 'execute': return handleExecute();
            case 'setInstructions': return handleSetInstructions(message.instructions);
            case 'writeConsole': return handleWriteConsole(message.message);
        }
    }

    return reduceShellState;
}