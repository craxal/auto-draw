import { Angle } from '../Graphics/Angle';
import { DrawContext } from '../Graphics/DrawContext';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';

export type TurnRightInstructionData = {
    type: 'turnRight';
    angle: number;
};

export class TurnRightInstruction extends Instruction {
    public angle: Angle;

    constructor(angle: number = 90) {
        super();

        this.angle = new Angle({ degrees: angle });
    }

    public static create(data: TurnRightInstructionData): TurnRightInstruction {
        return new TurnRightInstruction(data.angle);
    }

    public get type(): InstructionType { return 'turnRight'; }

    public execute(context: DrawContext): void {
        context.turnRight(this.angle);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle });
    }
}
