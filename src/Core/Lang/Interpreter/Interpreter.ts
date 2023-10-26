import { DrawContext } from "../../Graphics/DrawContext";
import { ArcLeftInstruction } from "../Parser/ArcLeftInstruction";
import { ArcRightInstruction } from "../Parser/ArcRightInstruction";
import { CallFunctionInstruction } from "../Parser/CallFunctionInstruction";
import { DefineFunctionInstruction } from "../Parser/DefineFunctionInstruction";
import { Instruction } from "../Parser/Instruction";
import { InstructionVisitor } from "../Parser/InstructionVisitor";
import { MoveForwardInstruction } from "../Parser/MoveForwardInstruction";
import { PenColorInstruction } from "../Parser/PenColorInstruction";
import { PenDownInstruction } from "../Parser/PenDownInstruction";
import { PenUpInstruction } from "../Parser/PenUpInstruction";
import { Program } from "../Parser/Program";
import { TurnLeftInstruction } from "../Parser/TurnLeftInstruction";
import { TurnRightInstruction } from "../Parser/TurnRightInstruction";

class Environment {
    #values: Map<string, Instruction[]> = new Map();

    public define(name: string, value: Instruction[]): void {
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
    #pauseOn: number | undefined;
    #instructionPointer: number = 0;

    constructor(context: DrawContext, pauseOn?: number) {
        this.#context = context;
        this.#pauseOn = pauseOn;
    }

    public visitProgram(program: Program): void {
        // Hoist function declarations to avoid problems fo calling a function before it's declared.
        for (const instruction of program.instructions) {
            if (instruction instanceof DefineFunctionInstruction) {
                instruction.accept(this);
            }
        }

        for (const instruction of program.instructions) {
            instruction.accept(this);
        }
    }

    public visitArcLeftInstruction(instruction: ArcLeftInstruction): void {
        this.#context.arcLeft(instruction.angle, instruction.radius);
        this.#instructionPointer++;
    }

    public visitArcRightInstruction(instruction: ArcRightInstruction): void {
        this.#context.arcRight(instruction.angle, instruction.radius);
        this.#instructionPointer++;
    }

    public visitMoveForwardInstruction(instruction: MoveForwardInstruction): void {
        this.#context.moveForward(instruction.distance);
        this.#instructionPointer++;
    }

    public visitPenColorInstruction(instruction: PenColorInstruction): void {
        this.#context.setPenColor(instruction.color);
        this.#instructionPointer++;
    }

    public visitPenDownInstruction(_instruction: PenDownInstruction): void {
        this.#context.penDown();
        this.#instructionPointer++;
    }

    public visitPenUpInstruction(_instruction: PenUpInstruction): void {
        this.#context.penUp();
        this.#instructionPointer++;
    }

    public visitTurnLeftInstruction(instruction: TurnLeftInstruction): void {
        this.#context.turnLeft(instruction.angle);
        this.#instructionPointer++;
    }

    public visitTurnRightInstruction(instruction: TurnRightInstruction): void {
        this.#context.turnRight(instruction.angle);
        this.#instructionPointer++;
    }

    public visitDefineFunctionInstruction(instruction: DefineFunctionInstruction): void {
        this.#environment.define(instruction.name, instruction.instructions);
    }

    public visitCallFunctionInstruction(instruction: CallFunctionInstruction): void {
        const instructions = this.#environment.get(instruction.name);
        for (const instruction of instructions) {
            instruction.accept(this);
        }
    }
}
