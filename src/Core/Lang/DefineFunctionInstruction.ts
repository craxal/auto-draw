import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type FunctionInstructionData = {
    type: 'defineFunction';
    name: string;
    instructions: Instruction[];
};

export class DefineFunctionInstruction extends Instruction {
    public name: string;
    public instructions: Instruction[];

    constructor(name: string, instructions: Instruction[] = []) {
        super();

        this.name = name
        this.instructions = instructions;
    }

    public static create(data: FunctionInstructionData): DefineFunctionInstruction {
        return new DefineFunctionInstruction(data.name, data.instructions);
    }

    public override get type(): InstructionType { return 'defineFunction'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitDefineFunctionInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, name: this.name, instructions: this.instructions.length });
    }
}
