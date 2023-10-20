import { Angle } from '../Graphics/Angle';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type ArcLeftInstructionData = {
    type: 'arcLeft';
    angle: number;
    radius: number;
};

export class ArcLeftInstruction extends Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number = 0, radius: number = 0) {
        super();

        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public static create(data: ArcLeftInstructionData): ArcLeftInstruction {
        return new ArcLeftInstruction(data.angle, data.radius);
    }

    public override get type(): InstructionType { return 'arcLeft'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitArcLeftInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle, radius: this.radius });
    }
}
