import { ArcLeftInstruction } from "../Parser/ArcLeftInstruction";
import { ArcRightInstruction } from "../Parser/ArcRightInstruction";
import { CallFunctionInstruction } from "../Parser/CallFunctionInstruction";
import { DefineFunctionInstruction } from "../Parser/DefineFunctionInstruction";
import { InstructionVisitor } from "../Parser/InstructionVisitor";
import { MoveForwardInstruction } from "../Parser/MoveForwardInstruction";
import { PenColorInstruction } from "../Parser/PenColorInstruction";
import { PenDownInstruction } from "../Parser/PenDownInstruction";
import { PenUpInstruction } from "../Parser/PenUpInstruction";
import { Program } from "../Parser/Program";
import { TurnLeftInstruction } from "../Parser/TurnLeftInstruction";
import { TurnRightInstruction } from "../Parser/TurnRightInstruction";

export class StringVisitor implements InstructionVisitor<string> {
    public visitProgram(program: Program): string {
        return program.instructions.reduce((str, i) => str + i.accept(this), '');
    }

    public visitArcLeftInstruction(instruction: ArcLeftInstruction): string {
        return `Arc left ${instruction.angle}° with radius ${instruction.radius}`;
    }

    public visitArcRightInstruction(instruction: ArcRightInstruction): string {
        return `Arc right ${instruction.angle}° with radius ${instruction.radius}`;
    }

    public visitMoveForwardInstruction(instruction: MoveForwardInstruction): string {
        return `Move forward ${instruction.distance} pixels`;
    }

    public visitPenColorInstruction(instruction: PenColorInstruction): string {
        return `Set pen color to ${instruction.color.toString()}`;

    }

    public visitPenDownInstruction(_instruction: PenDownInstruction): string {
        return `Place pen down`;

    }

    public visitPenUpInstruction(_instruction: PenUpInstruction): string {
        return `Pick pen up`;
    }

    public visitTurnLeftInstruction(instruction: TurnLeftInstruction): string {
        return `Turn left ${instruction.angle}°`;

    }

    public visitTurnRightInstruction(instruction: TurnRightInstruction): string {
        return `Turn right ${instruction.angle}°`;
    }

    public visitDefineFunctionInstruction(instruction: DefineFunctionInstruction): string {
        return `Define function named '${instruction.name} (${instruction.instructions.length} instructions)'`;

    }

    public visitCallFunctionInstruction(instruction: CallFunctionInstruction): string {
        return `Call function named '${instruction.name}'`;
    }
}
