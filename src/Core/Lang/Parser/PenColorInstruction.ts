import { Color } from '../../Graphics/Color';
import { Instruction } from './Instruction';
import { InstructionVisitor } from './InstructionVisitor';

export class PenColorInstruction extends Instruction {
    public color: Color;

    constructor(color: Color = Color.black) {
        super();

        this.color = color;
    }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitPenColorInstruction(this);
    }
}
