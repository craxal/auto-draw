import { Angle } from '../Types/Angle';
import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class ArcRightInstruction extends Instruction {
    public angle: Angle;
    public radius: number;

    constructor(angle: number = 0, radius: number = 0) {
        super();

        this.angle = new Angle({ degrees: angle });
        this.radius = radius;
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitArcRightInstruction(this);
    }
}
