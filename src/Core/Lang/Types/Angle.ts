import { Bool } from "./Bool";
import { IAddition } from "./IAddition";
import { IComparison } from "./IComparison";
import { IDivision } from "./IDivision";
import { IEquality } from "./IEquality";
import { IModulo } from "./IModulo";
import { IMultiplication } from "./IMultiplication";
import { ISubtraction } from "./ISubtraction";
import { ITrig } from "./ITrig";
import { Value } from "./Value";

type AngleConstructorArgs =
    | { degrees: number; }
    | { radians: number; }
    ;

export class Angle extends Value implements
    IAddition<Angle, Angle>,
    IComparison<Angle, Bool>,
    IDivision<Angle, Angle>,
    IEquality<Angle, Bool>,
    IModulo<Angle, Angle>,
    IMultiplication<Angle, Angle>,
    ISubtraction<Angle, Angle>,
    ITrig<number>
{
    #degrees: number;

    static readonly right = new Angle({ degrees: 90 });

    constructor(args?: AngleConstructorArgs) {
        super();

        if (!!args && 'radians' in args) {
            this.#degrees = args.radians * 180 / Math.PI;
        } else if (!!args && 'degrees' in args) {
            this.#degrees = args.degrees;
        } else {
            this.#degrees = 0;
        }
    }

    public get degrees(): number { return this.#degrees; }
    public get radians(): number { return this.#degrees * Math.PI / 180; }

    public static reduce(angle: Angle) {
        const normalizedValue = ((angle.degrees % 360) + 360) % 360;
        return normalizedValue > 180
            ? new Angle({ degrees: normalizedValue - 360 })
            : new Angle({ degrees: normalizedValue });
    }

    public static add(left: Angle, right: Angle): Angle {
        return new Angle({ degrees: left.degrees + right.degrees });
    }

    public static subtract(left: Angle, right: Angle): Angle {
        return new Angle({ degrees: left.degrees - right.degrees });
    }

    public static negate(self: Angle): Angle {
        return new Angle({ degrees: -self.degrees });
    }

    public static multiply(left: Angle, right: Angle): Angle {
        return new Angle({ degrees: left.degrees * right.degrees });
    }

    public static divide(left: Angle, right: Angle): Angle {
        return new Angle({ degrees: left.degrees / right.degrees });
    }

    public static modulo(left: Angle, right: Angle): Angle {
        return new Angle({ degrees: left.degrees % right.degrees });
    }

    public static lessThan(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees < right.degrees);
    }

    public static lessThanOrEqual(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees <= right.degrees);
    }

    public static greaterThan(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees > right.degrees);
    }

    public static greaterThanOrEqual(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees >= right.degrees);
    }

    public static equal(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees === right.degrees);
    }

    public static notEqual(left: Angle, right: Angle): Bool {
        return new Bool(left.degrees !== right.degrees);
    }

    public static cos(self: Angle): number {
        return Math.cos(self.radians);
    }

    public static sin(self: Angle): number {
        return Math.sin(self.radians);
    }

    public add(other: Angle): Angle {
        return Angle.add(this, other);
    }

    public subtract(other: Angle): Angle {
        return Angle.subtract(this, other);
    }

    public negate(): Angle {
        return Angle.negate(this);
    }

    public multiply(other: Angle): Angle {
        return Angle.multiply(this, other);
    }

    public divide(other: Angle): Angle {
        return Angle.divide(this, other);
    }

    public modulo(other: Angle): Angle {
        return Angle.modulo(this, other);
    }

    public lessThan(other: Angle): Bool {
        return Angle.lessThan(this, other);
    }

    public lessThanOrEqual(other: Angle): Bool {
        return Angle.lessThanOrEqual(this, other);
    }

    public greaterThan(other: Angle): Bool {
        return Angle.greaterThan(this, other);
    }

    public greaterThanOrEqual(other: Angle): Bool {
        return Angle.greaterThanOrEqual(this, other);
    }

    public equal(other: Angle): Bool {
        return Angle.equal(this, other);
    }

    public notEqual(other: Angle): Bool {
        return Angle.notEqual(this, other);
    }

    public cos(): number {
        return Angle.cos(this);
    }

    public sin(): number {
        return Angle.sin(this);
    }

    public toString(): string {
        return `${this.#degrees}°`;
    }
}
