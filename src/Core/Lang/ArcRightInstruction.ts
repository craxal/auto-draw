import { Angle } from '../Graphics/Angle';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

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

    public override get type(): InstructionType { return 'arcRight'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitArcRightInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle, radius: this.radius });
    }
}
