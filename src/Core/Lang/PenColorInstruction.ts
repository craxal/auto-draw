import { Color } from '../Graphics/Color';
import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

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

    public get type(): InstructionType { return 'penColor'; }

    public execute(context: DrawContext): void {
        context.setPenColor(this.color);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, color: this.color.toHex() });
    }
}
