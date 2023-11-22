import { Bool } from "./Bool";
import { IEquality } from "./IEquality";
import { Value } from "./Value";

const regex = /^#(?<r>[0-9A-F]{2})(?<g>[0-9A-F]{2})(?<b>[0-9A-F]{2})$/i;

function toHexString(n: number): string {
    return `${n.toString(16).padStart(2, '0')}`;
}

export class Color extends Value implements
    IEquality<Color, Bool>
{
    static black = new Color(0, 0, 0);
    static blue = new Color(0x00, 0x00, 0xFF);
    static gray = new Color(0x7F, 0x7F, 0x7F);
    static green = new Color(0x00, 0xFF, 0x00);
    static orange = new Color(0xFF, 0x7F, 0x7F);
    static red = new Color(0xFF, 0, 0);
    static violet = new Color(0x7F, 0, 0xFF);
    static white = new Color(0xFF, 0xFF, 0xFF);
    static yellow = new Color(0xFF, 0xFF, 0);

    #r: number;
    #g: number;
    #b: number;

    constructor(r: number, g: number, b: number) {
        super();

        this.#r = r;
        this.#g = g;
        this.#b = b;
    }

    public static fromHex(hex: string): Color {
        const match = regex.exec(hex);
        if (!!match) {
            return new Color(
                Number.parseInt(match.groups?.r ?? '0', 16),
                Number.parseInt(match.groups?.g ?? '0', 16),
                Number.parseInt(match.groups?.b ?? '0', 16),
            );
        } else {
            throw new Error(`Unable to parse color value from ${hex}`);
        }
    }

    public static equal(left: Color, right: Color): Bool {
        return new Bool(left.#r === right.#r && left.#g === right.#g && left.#b === right.#b);
    }

    public static notEqual(left: Color, right: Color): Bool {
        return new Bool(left.#r !== right.#r || left.#g !== right.#g || left.#b !== right.#b);
    }

    public equal(other: Color): Bool {
        return Color.equal(this, other);
    }

    public notEqual(other: Color): Bool {
        return Color.notEqual(this, other);
    }

    public toHex(): string {
        return `#${toHexString(this.#r)}${toHexString(this.#g)}${toHexString(this.#b)}`;
    }

    public toSwatchString(): string {
        return `\u001b[37;40m[\u001b[38;2;${this.#r};${this.#g};${this.#b}m\u25a0\u001b[37m]\u001b[0m`;
    }

    public toString(): string {
        return this.toHex();
    }
}
