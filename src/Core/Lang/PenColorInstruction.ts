import { Color } from '../Graphics/Color';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

export type PenColorInstructionData = {
    type: 'penColor';
    color: string;
};

export class PenColorInstruction extends Instruction {
    public color: Color;

    constructor(color: Color = Color.black) {
        super();

        this.color = color;
    }

    public static create(data: PenColorInstructionData): PenColorInstruction {
        return new PenColorInstruction(Color.fromHex(data.color));
    }

    public override get type(): InstructionType { return 'penColor'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenColorInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, color: this.color.toHex() });
    }
}
