import { Angle } from '../Graphics/Angle';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

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

    public override get type(): InstructionType { return 'turnLeft'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitTurnLeftInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle });
    }
}
