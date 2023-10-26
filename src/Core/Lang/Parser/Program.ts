import { Instruction } from "./Instruction";

export class Program {
    #instructions: Instruction[];

    constructor(instructions: Instruction[]) {
        this.#instructions = instructions;
    }

    public get instructions(): Instruction[] { return this.#instructions; }
}
