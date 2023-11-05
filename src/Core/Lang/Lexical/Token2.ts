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
    | 'IF'
    | 'LET'
    | 'OR'
    | 'TRUE'
    | 'VAR'
    | 'WHILE'
    | 'EOF'
    ;

export class Token2 {
    constructor(
        public readonly type: TokenType2,
        public readonly lexeme: string,
        public readonly literal: any,
        public readonly line: number
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString(): string {
        return `${this.type} '${this.lexeme}' ${this.literal}`;
    }
}
