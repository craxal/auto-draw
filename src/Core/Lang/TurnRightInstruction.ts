import { Angle } from '../Graphics/Angle';
import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

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

    public override get type(): InstructionType { return 'turnRight'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitTurnRightInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, angle: this.angle });
    }
}
