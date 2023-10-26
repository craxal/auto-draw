import { Reducer } from "react";
import { Token } from "../../../Core/Lang/Lexical/Token";
import { Parser } from "../../../Core/Lang/Parser/Parser";
import { Program } from "../../../Core/Lang/Parser/Program";

export type ShellState = {
    instructions: Token[];
    program?: Program;
    error?: string;
};

export type ShellAction =
    | { action: 'parse'; }
    | { action: "setInstructions", instructions: Token[]; }
    ;

export function getShellStateReducer(): Reducer<ShellState, ShellAction> {
    function reduceShellState(state: ShellState, message: ShellAction): ShellState {
        function handleParse(): ShellState {
            const result = new Parser(state.instructions).parse();
            if (result.type === 'error') {
                return { ...state, program: undefined, error: `Error on line ${result.error.token.line + 1}: ${result.error.message}` };
            } else {
                return { ...state, program: result.result, error: undefined };
            }
        }

        function handleSetLines(instructions: Token[]): ShellState {
            const result = new Parser(instructions).parse();
            if (result.type === 'error') {
                return { ...state, instructions, program: undefined, error: `Error on line ${result.error.token.line + 1}: ${result.error.message}` };
            } else {
                return { ...state, instructions, program: result.result, error: undefined };
            }
        }

        switch (message.action) {
            case 'parse': return handleParse();
            case 'setInstructions': return handleSetLines(message.instructions);
        }
    }

    return reduceShellState;
}