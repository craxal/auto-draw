import { DrawContext } from '../Graphics/DrawContext';
import { InstructionType } from './InstructionType';

export abstract class Instruction {
    public abstract get type(): InstructionType;
    public abstract execute(context: DrawContext): void;

    public toString(): string {
        return JSON.stringify({ type: this.type });
    }
}
