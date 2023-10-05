import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type PenDownInstructionData = {
    type: 'penDown';
};

export class PenDownInstruction extends Instruction {
    public get type(): InstructionType { return 'penDown'; }

    public execute(context: DrawContext): void {
        context.penDown();
    }
}
