import { Value } from "../Types/Value";

export type TokenType2 =
    | 'LEFT_PAREN'
    | 'RIGHT_PAREN'
    | 'LEFT_BRACE'
    | 'RIGHT_BRACE'
    | 'COMMA'
    | 'MINUS'
    | 'PLUS'
    | 'SEMICOLON'
    | 'SLASH'
    | 'STAR'

    // One or two character tokens
    | 'ARROW'
    | 'BANG'
    | 'BANG_EQUAL'
    | 'EQUAL'
    | 'EQUAL_EQUAL'
    | 'GREATER'
    | 'GREATER_EQUAL'
    | 'LESS'
    | 'LESS_EQUAL'
    | 'MOD'

    // Literals
    | 'ANGLE'
    | 'BLACK'
    | 'BLUE'
    | 'COLOR'
    | 'GREEN'
    | 'IDENTIFIER'
    | 'NUMBER'
    | 'ORANGE'
    | 'RED'
    | 'VIOLET'
    | 'WHITE'
    | 'YELLOW'

    // Keywords
    | 'AND'
    | 'ELSE'
    | 'FALSE'
    | 'FUNC'
    | 'IF'
    | 'LET'
    | 'OR'
    | 'RETURN'
    | 'TRUE'
    | 'VAR'
    | 'WHILE'
    | 'EOF'
    ;

export class Token2 {
    constructor(
        public readonly type: TokenType2,
        public readonly lexeme: string,
        public readonly literal: Value | undefined,
        public readonly line: number,
        public readonly char: number,
    ) { }

    public toString(): string {
        return `${this.type}:${this.line}:${this.char} '${this.lexeme}'${this.literal ? ` ${this.literal}` : ''}`;
    }
}
