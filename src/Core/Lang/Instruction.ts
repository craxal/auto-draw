import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export abstract class Instruction {
    public abstract get type(): InstructionType;
    public abstract accept<TResult>(visitor: InstructionVisitor<TResult>): TResult;

    public toString(): string {
        return JSON.stringify({ type: this.type });
    }
}
