import { IBitwise } from "./IBitwise";
import { IEquality } from "./IEquality";
import { Value } from "./Value";

export class Bool extends Value implements
    IBitwise<Bool, Bool>,
    IEquality<Bool, Bool>
{
    #value: boolean;

    constructor(value: boolean) {
        super();

        this.#value = value;
    }

    public get value(): boolean { return this.#value; }

    public static and(left: Bool, right: Bool): Bool {
        return new Bool(left.value && right.value);
    }

    public static or(left: Bool, right: Bool): Bool {
        return new Bool(left.value || right.value);
    }

    public static xor(left: Bool, right: Bool): Bool {
        return new Bool(left.value !== right.value);
    }

    public static not(self: Bool): Bool {
        return new Bool(!self.value);
    }

    public static equal(left: Bool, right: Bool): Bool {
        return new Bool(left.value === right.value);
    }

    public static notEqual(left: Bool, right: Bool): Bool {
        return new Bool(left.value !== right.value);
    }

    public and(other: Bool): Bool {
        return Bool.and(this, other);
    }

    public or(other: Bool): Bool {
        return Bool.or(this, other);
    }

    public xor(other: Bool): Bool {
        return Bool.xor(this, other);
    }

    public not(): Bool {
        return Bool.not(this);
    }

    public equal(other: Bool): Bool {
        return Bool.equal(this, other);
    }

    public notEqual(other: Bool): Bool {
        return Bool.notEqual(this, other);
    }

    public toString(): string {
        return `${this.#value}`;
    }
}
