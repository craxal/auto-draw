import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class MoveForwardInstruction extends Instruction {
    public distance: number;

    constructor(distance: number = 0) {
        super();

        this.distance = distance;
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitMoveForwardInstruction(this);
    }
}
