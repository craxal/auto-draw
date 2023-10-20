import { Instruction } from './Instruction';
import { InstructionType } from './InstructionType';
import { InstructionVisitor } from './InstructionVisitor';

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

    public override get type(): InstructionType { return 'moveForward'; }

    public override accept<TResult>(visitor: InstructionVisitor<TResult>): TResult {
        return visitor.visitMoveForwardInstruction(this);
    }

    public override toString(): string {
        return JSON.stringify({ type: this.type, distance: this.distance });
    }
}
