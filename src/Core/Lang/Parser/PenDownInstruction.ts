import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class PenDownInstruction extends Instruction {
    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenDownInstruction(this);
    }
}
