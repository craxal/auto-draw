import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type PenUpInstructionData = {
    type: 'penUp';
};

export class PenUpInstruction extends Instruction {
    public override get type(): InstructionType { return 'penUp'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenUpInstruction(this);
    }
}
