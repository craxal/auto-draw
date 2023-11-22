import { Bool } from "./Bool";
import { IAddition } from "./IAddition";
import { IComparison } from "./IComparison";
import { IDivision } from "./IDivision";
import { IEquality } from "./IEquality";
import { IModulo } from "./IModulo";
import { IMultiplication } from "./IMultiplication";
import { INegation } from "./INegation";
import { ISubtraction } from "./ISubtraction";
import { Value } from "./Value";

export class Integer extends Value implements
    IAddition<Integer, Integer>,
    IComparison<Integer, Bool>,
    IDivision<Integer, Integer>,
    IEquality<Integer, Bool>,
    IModulo<Integer, Integer>,
    IMultiplication<Integer, Integer>,
    ISubtraction<Integer, Integer>,
    INegation<Integer>
{
    #value: number;

    constructor(value: number) {
        super();

        this.#value = Math.floor(value);
    }

    public get value(): number { return this.#value; }

    public static add(self: Integer, other: Integer): Integer {
        return new Integer(self.value + other.value);
    }

    public static subtract(self: Integer, other: Integer): Integer {
        return new Integer(self.value - other.value);
    }

    public static negate(self: Integer): Integer {
        return new Integer(-self.value);
    }

    public static multiply(self: Integer, other: Integer): Integer {
        return new Integer(self.value * other.value);
    }

    public static divide(self: Integer, other: Integer): Integer {
        return new Integer(self.value / other.value);
    }

    public static modulo(self: Integer, other: Integer): Integer {
        return new Integer(self.value % other.value);
    }

    public static lessThan(self: Integer, other: Integer): Bool {
        return new Bool(self.value < other.value);
    }

    public static lessThanOrEqual(self: Integer, other: Integer): Bool {
        return new Bool(self.value <= other.value);
    }

    public static greaterThan(self: Integer, other: Integer): Bool {
        return new Bool(self.value > other.value);
    }

    public static greaterThanOrEqual(self: Integer, other: Integer): Bool {
        return new Bool(self.value >= other.value);
    }

    public static equal(self: Integer, other: Integer): Bool {
        return new Bool(self.value === other.value);
    }

    public static notEqual(self: Integer, other: Integer): Bool {
        return new Bool(self.value !== other.value);
    }

    public add(other: Integer): Integer {
        return Integer.add(this, other);
    }

    public subtract(other: Integer): Integer {
        return Integer.subtract(this, other);
    }

    public negate(): Integer {
        return Integer.negate(this);
    }

    public multiply(other: Integer): Integer {
        return Integer.multiply(this, other);
    }

    public divide(other: Integer): Integer {
        return Integer.divide(this, other);
    }

    public modulo(other: Integer): Integer {
        return Integer.modulo(this, other);
    }

    public lessThan(other: Integer): Bool {
        return Integer.lessThan(this, other);
    }

    public lessThanOrEqual(other: Integer): Bool {
        return Integer.lessThanOrEqual(this, other);
    }

    public greaterThan(other: Integer): Bool {
        return Integer.greaterThan(this, other);
    }

    public greaterThanOrEqual(other: Integer): Bool {
        return Integer.greaterThanOrEqual(this, other);
    }

    public equal(other: Integer): Bool {
        return Integer.equal(this, other);
    }

    public notEqual(other: Integer): Bool {
        return Integer.notEqual(this, other);
    }

    public toString(): string {
        return `${this.#value}`;
    }
}
