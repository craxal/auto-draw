import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type CallFunctionInstructionData = {
    type: 'callFunction';
    name: string;
    instructions: Instruction[];
};

export class CallFunctionInstruction extends Instruction {
    public name: string;

    constructor(name: string) {
        super();

        this.name = name
    }

    public static create(data: CallFunctionInstructionData): CallFunctionInstruction {
        return new CallFunctionInstruction(data.name);
    }

    public override get type(): InstructionType { return 'callFunction'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitCallFunctionInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, name: this.name });
    }
}
