import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class CallFunctionInstruction extends Instruction {
    public name: string;

    constructor(name: string) {
        super();

        this.name = name
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitCallFunctionInstruction(this);
    }
}
