import { Instruction } from '../../../Core/Instruction';
import { InstructionRow } from '../InstructionRow/InstructionRow';

export function InstructionsPanel(props: {
    instructions: Instruction[];
    onChange(instructions: Instruction[]): void;
}): JSX.Element {
    function onInstructionChange(instruction: Instruction, index: number): void {
        const newInstructions = [...props.instructions];
        newInstructions[index] = instruction;
        props.onChange(newInstructions);
    }
    return (
        <div className='instructions-panel'>
            <label htmlFor='instruction-list'>Instructions</label>
            <div id='instruction-list' className='instruction-list'>
                {
                    props.instructions.map((instruction, index) => (
                        <InstructionRow
                            key={index}
                            index={index}
                            instruction={instruction}
                            onChange={(newInstruction) => onInstructionChange(newInstruction, index)} />
                    ))
                }
            </div>
        </div>
    );
}


