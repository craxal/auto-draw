import { Angle } from './Graphics/Angle';
import { Color } from './Graphics/Color';
import { DrawContext } from './Graphics/DrawContext';

export type InstructionType =
    | 'penColor'
    | 'penUp'
    | 'penDown'
    | 'turnLeft'
    | 'turnRight'
    | 'arcLeft'
    | 'arcRight'
    | 'moveForward'
    ;

export interface Instruction {
    readonly type: InstructionType;
    execute(context: DrawContext): void;
}

export class PenColorInstruction implements Instruction {
    public color: Color;

    constructor(color: Color = Color.black) {
        this.color = color;
    }

    public get type(): InstructionType { return 'penColor'; }

    public execute(context: DrawContext): void {
        context.setPenColor(this.color);
    }
}

export class PenUpInstruction implements Instruction {
    public get type(): InstructionType { return 'penUp'; }

    public execute(context: DrawContext): void {
        context.penUp();
    }
}

export class PenDownInstruction implements Instruction {
    public get type(): InstructionType { return 'penDown'; }

    public execute(context: DrawContext): void {
        context.penDown();
    }
}

export class TurnLeftInstruction implements Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        this.angle = new Angle({ degrees: angle });
    }

    public get type(): InstructionType { return 'turnLeft'; }

    public execute(context: DrawContext): void {
        context.turnLeft(this.angle);
    }
}

export class TurnRightInstruction implements Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        this.angle = new Angle({ degrees: angle });
    }

    public get type(): InstructionType { return 'turnRight'; }

    public execute(context: DrawContext): void {
        context.turnRight(this.angle);
    }
}

export class ArcLeftInstruction implements Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number = 0, radius: number = 0) {
        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public get type(): InstructionType { return 'arcLeft'; }

    public execute(context: DrawContext): void {
        context.arcLeft(this.angle, this.radius);
    }
}

export class ArcRightInstruction implements Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number = 0, radius: number = 0) {
        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public get type(): InstructionType { return 'arcRight'; }

    public execute(context: DrawContext): void {
        context.arcRight(this.angle, this.radius);
    }
}

export class MoveForwardInstruction implements Instruction {
    public distance: number;

    constructor(distance: number = 0) {
        this.distance = distance;
    }

    public get type(): InstructionType { return 'moveForward'; }

    public execute(context: DrawContext): void {
        context.moveForward(this.distance);
    }
}
