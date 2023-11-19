import { Angle } from '../../Graphics/Angle';
import { Color } from '../../Graphics/Color';
import { Token2, TokenType2 } from './Token2';

type ScannerError = { line: number, message: string };

const keywords = new Map<String, TokenType2>([
    ['and', 'AND'],
    ['else', 'ELSE'],
    ['false', 'FALSE'],
    ['fn', 'FUNC'],
    ['if', 'IF'],
    ['let', 'LET'],
    ['or', 'OR'],
    ['return', 'RETURN'],
    ['true', 'TRUE'],
    ['var', 'VAR'],
    ['while', 'WHILE'],
]);
const colors = new Map<string, Color>([
    ['black', Color.black],
    ['blue', Color.blue],
    ['gray', Color.gray],
    ['green', Color.green],
    ['orange', Color.orange],
    ['red', Color.red],
    ['violet', Color.violet],
    ['white', Color.white],
    ['yellow', Color.yellow],
]);

export class Scanner {
    #source: string;
    #tokens: Token2[] = [];
    #start: number = 0;
    #current: number = 0;
    #line: number = 1;
    #char: number = 1;
    #errors: ScannerError[] = [];

    constructor(source: string) {
        this.#source = source;
    }

    public scan(): Token2[] {
        while (!this.#end()) {
            // We are at the beginning of the next lexeme.
            this.#start = this.#current;
            this.#scanToken();
        }

        this.#tokens.push(new Token2('EOF', '', null, this.#line, this.#char));

        return this.#tokens;
    }

    #end(): boolean {
        return this.#current >= this.#source.length;
    }

    #scanToken(): void {
        const char = this.#advance();
        switch (char) {
            case '(': this.#addToken('LEFT_PAREN'); break;
            case ')': this.#addToken('RIGHT_PAREN'); break;
            case '{': this.#addToken('LEFT_BRACE'); break;
            case '}': this.#addToken('RIGHT_BRACE'); break;
            case ',': this.#addToken('COMMA'); break;
            case '-': this.#addToken('MINUS'); break;
            case '+': this.#addToken('PLUS'); break;
            case ';': this.#addToken('SEMICOLON'); break;
            case '*': this.#addToken('STAR'); break;
            case '/':
                if (this.#match('/')) {
                    while (this.#peek() != '\n' && !this.#end()) {
                        this.#advance();
                    }
                } else {
                    this.#addToken('SLASH');
                }
                break;
            case '!': this.#addToken(this.#match('=') ? 'BANG_EQUAL' : 'BANG'); break;
            case '=': this.#addToken(this.#match('=') ? 'EQUAL_EQUAL' : this.#match('>') ? 'ARROW' : 'EQUAL'); break;
            case '<': this.#addToken(this.#match('=') ? 'LESS_EQUAL' : 'LESS'); break;
            case '>': this.#addToken(this.#match('=') ? 'GREATER_EQUAL' : 'GREATER'); break;
            case '#': this.#addColorToken(); break;
            case ' ': break;
            case '\r': break;
            case '\t': break;
            case '\n': this.#line++; this.#char = 1; break;
            default:
                if (char.match(/[0-9]/)) {
                    this.#addNumberToken();
                } else if (char.match(/[a-z_]/i)) {
                    this.#addIdentifierToken();
                } else {
                    this.#errors.push({ line: this.#line, message: `Unexpected character '${char}'` }); break;
                }
        }
    }

    #peek(): string {
        if (this.#end()) {
            return '';
        };

        return this.#source.charAt(this.#current);
    }

    #advance(): string {
        this.#char++;
        return this.#source.charAt(this.#current++);
    }

    #match(expected: string): boolean {
        if (this.#end()) {
            return false;
        }

        let matchCurrent = 0;
        for (const char of expected) {
            if (this.#source.charAt(this.#current + matchCurrent) !== char) {
                return false;
            }

            matchCurrent++;
        }

        this.#current += matchCurrent;
        this.#char += matchCurrent;

        return true;
    }

    #addToken(type: TokenType2, literal?: any): void {
        const text = this.#source.substring(this.#start, this.#current);
        this.#tokens.push(new Token2(type, text, literal, this.#line, this.#char));
    }

    #addColorToken(): void {
        while (this.#peek().match(/[0-9a-z]/i)) {
            this.#advance();
        }

        const value = this.#source.substring(this.#start, this.#current);
        this.#addToken('COLOR', colors.get(value.slice(1)) ?? Color.fromHex(value));
    }

    #addNumberToken(): void {
        while (this.#peek().match(/[0-9]/)) {
            this.#advance();
        }
        const value = Number.parseInt(this.#source.substring(this.#start, this.#current));
        if (this.#match('deg')) {
            this.#addToken('ANGLE', new Angle({ degrees: value }));
        } else if (this.#match('rad')) {
            this.#addToken('ANGLE', new Angle({ radians: value }));
        } else {
            this.#addToken('NUMBER', value);
        }
    }

    #addIdentifierToken(): void {
        while (this.#peek().match(/[a-z_]/i)) {
            this.#advance();
        }

        const text = this.#source.substring(this.#start, this.#current);
        const type = keywords.get(text) ?? 'IDENTIFIER';

        this.#addToken(type);
    }
}