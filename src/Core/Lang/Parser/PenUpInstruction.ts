import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class PenUpInstruction extends Instruction {
    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenUpInstruction(this);
    }
}
