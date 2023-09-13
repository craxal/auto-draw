import { Angle } from './Angle';
import { Color } from './Color';
import { DrawContext } from './DrawContext';

export interface Instruction {
    readonly name: string;
    execute(context: DrawContext): void;
}

export class PenColorInstruction implements Instruction {
    public color: Color;

    constructor(color: Color) {
        this.color = color;
    }

    public get name(): string { return 'penColor'; }

    public execute(context: DrawContext): void {
        context.setPenColor(this.color);
    }
}

export class PenUpInstruction implements Instruction {
    public get name(): string { return 'penUp'; }

    public execute(context: DrawContext): void {
        context.penUp();
    }
}

export class PenDownInstruction implements Instruction {
    public get name(): string { return 'penDown'; }

    public execute(context: DrawContext): void {
        context.penDown();
    }
}

export class TurnLeftInstruction implements Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        this.angle = new Angle({ degrees: angle });
    }

    public get name(): string { return 'turnLeft'; }

    public execute(context: DrawContext): void {
        context.turnLeft(this.angle);
    }
}

export class TurnRightInstruction implements Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        this.angle = new Angle({ degrees: angle });
    }

    public get name(): string { return 'turnRight'; }

    public execute(context: DrawContext): void {
        context.turnRight(this.angle);
    }
}

export class ArcLeftInstruction implements Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number, radius: number) {
        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public get name(): string { return 'arcLeft'; }

    public execute(context: DrawContext): void {
        context.arcLeft(this.angle, this.radius);
    }
}

export class ArcRightInstruction implements Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number, radius: number) {
        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public get name(): string { return 'arcRight'; }

    public execute(context: DrawContext): void {
        context.arcRight(this.angle, this.radius);
    }
}

export class MoveForwardInstruction implements Instruction {
    public distance: number;

    constructor(distance: number) {
        this.distance = distance;
    }

    public get name(): string { return 'moveForward'; }

    public execute(context: DrawContext): void {
        context.moveForward(this.distance);
    }
}
