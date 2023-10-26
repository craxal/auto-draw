import { DrawContext } from '../../Graphics/DrawContext';
import { Result } from '../../Util/Result';
import { ArcLeftInstruction } from '../Parser/ArcLeftInstruction';
import { ArcRightInstruction } from '../Parser/ArcRightInstruction';
import { CallFunctionInstruction } from '../Parser/CallFunctionInstruction';
import { DefineFunctionInstruction } from '../Parser/DefineFunctionInstruction';
import { Instruction } from '../Parser/Instruction';
import { InstructionVisitor } from '../Parser/InstructionVisitor';
import { MoveForwardInstruction } from '../Parser/MoveForwardInstruction';
import { PenColorInstruction } from '../Parser/PenColorInstruction';
import { PenDownInstruction } from '../Parser/PenDownInstruction';
import { PenUpInstruction } from '../Parser/PenUpInstruction';
import { Program } from '../Parser/Program';
import { TurnLeftInstruction } from '../Parser/TurnLeftInstruction';
import { TurnRightInstruction } from '../Parser/TurnRightInstruction';

type RuntimeError = { message: string };

class Environment {
    #values: Map<string, Instruction[]> = new Map();

    public define(name: string, value: Instruction[]): Result<void, RuntimeError> {
        if (this.#values.has(name)) {
            return { type: 'error', error: { message: `Variable '${name}' is already defined` } };
        }

        this.#values.set(name, value);

        return { type: 'result', result: undefined };
    }

    public get(name: string): Result<Instruction[], RuntimeError> {
        const value = this.#values.get(name);
        if (!value) {
            return { type: 'error', error: { message: `Undefined variable '${name}'` } };
        }

        return { type: 'result', result: value };
    }
}

export class Interpreter implements InstructionVisitor<Result<void, RuntimeError>> {
    #context: DrawContext | undefined;
    #environment: Environment = new Environment();
    #pauseOn: number | undefined;
    #instructionPointer: number = 0;

    constructor(context?: DrawContext, pauseOn?: number) {
        this.#context = context;
        this.#pauseOn = pauseOn;
    }

    public visitProgram(program: Program): Result<void, RuntimeError> {
        // Hoist function declarations to avoid problems fo calling a function before it's declared.
        for (const instruction of program.instructions) {
            if (instruction instanceof DefineFunctionInstruction) {
                const defResult = instruction.accept(this);
                if (defResult.type === 'error') {
                    return { type: 'error', error: { message: `Tried to redefine function '${instruction.name}'` } };
                }
            }
        }

        for (const instruction of program.instructions) {
            if (!(instruction instanceof DefineFunctionInstruction)) {
                const instructionResult = instruction.accept(this);
                if (instructionResult.type === 'error') {
                    return instructionResult;
                }
            }
        }

        return { type: 'result', result: undefined };
    }

    public visitArcLeftInstruction(instruction: ArcLeftInstruction): Result<void, RuntimeError> {
        this.#context?.arcLeft(instruction.angle, instruction.radius);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitArcRightInstruction(instruction: ArcRightInstruction): Result<void, RuntimeError> {
        this.#context?.arcRight(instruction.angle, instruction.radius);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitMoveForwardInstruction(instruction: MoveForwardInstruction): Result<void, RuntimeError> {
        this.#context?.moveForward(instruction.distance);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitPenColorInstruction(instruction: PenColorInstruction): Result<void, RuntimeError> {
        this.#context?.setPenColor(instruction.color);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitPenDownInstruction(_instruction: PenDownInstruction): Result<void, RuntimeError> {
        this.#context?.penDown();
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitPenUpInstruction(_instruction: PenUpInstruction): Result<void, RuntimeError> {
        this.#context?.penUp();
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitTurnLeftInstruction(instruction: TurnLeftInstruction): Result<void, RuntimeError> {
        this.#context?.turnLeft(instruction.angle);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitTurnRightInstruction(instruction: TurnRightInstruction): Result<void, RuntimeError> {
        this.#context?.turnRight(instruction.angle);
        this.#instructionPointer++;

        return { type: 'result', result: undefined };
    }

    public visitDefineFunctionInstruction(instruction: DefineFunctionInstruction): Result<void, RuntimeError> {
        return this.#environment.define(instruction.name, instruction.instructions);
    }

    public visitCallFunctionInstruction(instruction: CallFunctionInstruction): Result<void, RuntimeError> {
        const result = this.#environment.get(instruction.name);
        if (result.type === 'error') {
            return { type: 'error', error: { message: `Tried to call undefined function '${instruction.name}'` } };
        } else {
            const instructions = result.result;
            for (const instruction of instructions) {
                const instructionResult = instruction.accept(this);
                if (instructionResult.type === 'error') {
                    return instructionResult;
                }
            }

            return { type: 'result', result: undefined };
        }
    }
}
