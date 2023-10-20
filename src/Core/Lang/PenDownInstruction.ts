import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type PenDownInstructionData = {
    type: 'penDown';
};

export class PenDownInstruction extends Instruction {
    public override get type(): InstructionType { return 'penDown'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenDownInstruction(this);
    }
}
