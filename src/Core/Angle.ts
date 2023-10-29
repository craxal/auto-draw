type AngleConstructorArgs =
    | { degrees: number }
    | { radians: number }
    ;

export class Angle {
    #degrees: number;

    static readonly right = new Angle({ degrees: 90 });

    constructor(args?: AngleConstructorArgs) {
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

    public static normalize(angle: Angle) {
        const normalizedValue = ((angle.degrees % 360) + 360) % 360;
        return normalizedValue > 180
            ? new Angle({ degrees: normalizedValue - 360 })
            : new Angle({ degrees: normalizedValue });
    }

    public static add(...angles: Angle[]): Angle {
        return new Angle({ degrees: angles.reduce((sum, a) => sum += a.degrees, 0) });
    }

    public static subtract(a: Angle, ...angles: Angle[]): Angle {
        return new Angle({ degrees: angles.reduce((diff, a) => diff -= a.degrees, a.degrees) });
    }

    public toString(): string {
        return `${this.#degrees}°`;
    }
}

export function cos(angle: Angle): number {
    return Math.cos(angle.radians);
}

export function sin(angle: Angle): number {
    return Math.sin(angle.radians);
}
