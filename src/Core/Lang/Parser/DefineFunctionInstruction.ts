import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class DefineFunctionInstruction extends Instruction {
    public name: string;
    public instructions: Instruction[];

    constructor(name: string, instructions: Instruction[] = []) {
        super();

        this.name = name
        this.instructions = instructions;
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitDefineFunctionInstruction(this);
    }
}
