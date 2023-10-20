import { ArcLeftInstruction } from "./ArcLeftInstruction";
import { ArcRightInstruction } from "./ArcRightInstruction";
import { CallFunctionInstruction } from "./CallFunctionInstruction";
import { DefineFunctionInstruction } from "./DefineFunctionInstruction";
import { MoveForwardInstruction } from "./MoveForwardInstruction";
import { PenColorInstruction } from "./PenColorInstruction";
import { PenDownInstruction } from "./PenDownInstruction";
import { PenUpInstruction } from "./PenUpInstruction";
import { TurnLeftInstruction } from "./TurnLeftInstruction";
import { TurnRightInstruction } from "./TurnRightInstruction";

export interface InstructionVisitor<TResult> {
    visitArcLeftInstruction(instruction: ArcLeftInstruction): TResult;
    visitArcRightInstruction(instruction: ArcRightInstruction): TResult;
    visitMoveForwardInstruction(instruction: MoveForwardInstruction): TResult;
    visitPenColorInstruction(instruction: PenColorInstruction): TResult;
    visitPenDownInstruction(instruction: PenDownInstruction): TResult;
    visitPenUpInstruction(instruction: PenUpInstruction): TResult;
    visitTurnLeftInstruction(instruction: TurnLeftInstruction): TResult;
    visitTurnRightInstruction(instruction: TurnRightInstruction): TResult;
    visitDefineFunctionInstruction(instruction: DefineFunctionInstruction): TResult;
    visitCallFunctionInstruction(instruction: CallFunctionInstruction): TResult;
}
