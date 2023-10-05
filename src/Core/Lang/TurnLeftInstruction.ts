import { Angle } from '../Graphics/Angle';
import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type TurnLeftInstructionData = {
    type: 'turnLeft';
    angle: number;
};

export class TurnLeftInstruction extends Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        super();

        this.angle = new Angle({ degrees: angle });
    }

    public static create(data: TurnLeftInstructionData): TurnLeftInstruction {
        return new TurnLeftInstruction(data.angle);
    }

    public get type(): InstructionType { return 'turnLeft'; }

    public execute(context: DrawContext): void {
        context.turnLeft(this.angle);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle });
    }
}
