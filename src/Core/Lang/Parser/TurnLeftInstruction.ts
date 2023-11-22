import { Angle } from '../Types/Angle';
import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class TurnLeftInstruction extends Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        super();

        this.angle = new Angle({ degrees: angle });
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitTurnLeftInstruction(this);
    }
}
