import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type PenUpInstructionData = {
    type: 'penUp';
};

export class PenUpInstruction extends Instruction {
    public get type(): InstructionType { return 'penUp'; }

    public execute(context: DrawContext): void {
        context.penUp();
    }
}
