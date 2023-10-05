import { Angle } from '../Graphics/Angle';
import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type ArcRightInstructionData = {
    type: 'arcRight';
    angle: number;
    radius: number;
};

export class ArcRightInstruction extends Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number = 0, radius: number = 0) {
        super();

        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public static create(data: ArcRightInstructionData): ArcRightInstruction {
        return new ArcRightInstruction(data.angle, data.radius);
    }

    public get type(): InstructionType { return 'arcRight'; }

    public execute(context: DrawContext): void {
        context.arcRight(this.angle, this.radius);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle, radius: this.radius });
    }
}
