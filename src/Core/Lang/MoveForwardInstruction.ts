import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type MoveForwardInstructionData = {
    type: 'moveForward';
    distance: number;
};

export class MoveForwardInstruction extends Instruction {
    public distance: number;

    constructor(distance: number = 0) {
        super();

        this.distance = distance;
    }

    public static create(data: MoveForwardInstructionData): MoveForwardInstruction {
        return new MoveForwardInstruction(data.distance);
    }

    public get type(): InstructionType { return 'moveForward'; }

    public execute(context: DrawContext): void {
        context.moveForward(this.distance);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, distance: this.distance });
    }
}
