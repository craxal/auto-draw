import { DrawContext } from "../Graphics/DrawContext";
import { ArcLeftInstruction } from "./ArcLeftInstruction";
import { ArcRightInstruction } from "./ArcRightInstruction";
import { CallFunctionInstruction } from "./CallFunctionInstruction";
import { DefineFunctionInstruction } from "./DefineFunctionInstruction";
import { Instruction } from "./Instruction";
import { InstructionVisitor } from "./InstructionVisitor";
import { MoveForwardInstruction } from "./MoveForwardInstruction";
import { PenColorInstruction } from "./PenColorInstruction";
import { PenDownInstruction } from "./PenDownInstruction";
import { PenUpInstruction } from "./PenUpInstruction";
import { TurnLeftInstruction } from "./TurnLeftInstruction";
import { TurnRightInstruction } from "./TurnRightInstruction";

class Environment {
    #values: Map<string, Instruction[]> = new Map();

    public define(name: string, value: any): void {
        this.#values.set(name, value);
    }

    public get(name: string): Instruction[] {
        const value = this.#values.get(name);
        if (!value) {
            throw new Error(`Undefined function '${name}'`);
        }

        return value;
    }
}

export class Interpreter implements InstructionVisitor<void> {
    #context: DrawContext;
    #environment: Environment = new Environment();

    constructor(context: DrawContext) {
        this.#context = context;
    }

    public visitArcLeftInstruction(instruction: ArcLeftInstruction): void {
        this.#context.arcLeft(instruction.angle, instruction.radius);
    }

    public visitArcRightInstruction(instruction: ArcRightInstruction): void {
        this.#context.arcRight(instruction.angle, instruction.radius);
    }

    public visitMoveForwardInstruction(instruction: MoveForwardInstruction): void {
        this.#context.moveForward(instruction.distance);
    }

    public visitPenColorInstruction(instruction: PenColorInstruction): void {
        this.#context.setPenColor(instruction.color);
    }

    public visitPenDownInstruction(_instruction: PenDownInstruction): void {
        this.#context.penDown();
    }

    public visitPenUpInstruction(_instruction: PenUpInstruction): void {
        this.#context.penUp();
    }

    public visitTurnLeftInstruction(instruction: TurnLeftInstruction): void {
        this.#context.turnLeft(instruction.angle);
    }

    public visitTurnRightInstruction(instruction: TurnRightInstruction): void {
        this.#context.turnRight(instruction.angle);
    }

    public visitDefineFunctionInstruction(instruction: DefineFunctionInstruction): void {
        this.#environment.define(instruction.name, null);
    }

    public visitCallFunctionInstruction(instruction: CallFunctionInstruction): void {
        const instructions = this.#environment.get(instruction.name);
        for (const instruction of instructions) {
            instruction.accept(this);
        }
    }
}
