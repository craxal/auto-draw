import { InstructionVisitor } from './InstructionVisitor';

export abstract class Instruction {
    public abstract accept<TResult>(visitor: InstructionVisitor<TResult>): TResult;
}
