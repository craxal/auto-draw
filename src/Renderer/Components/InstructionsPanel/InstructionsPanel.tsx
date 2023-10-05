import { Instruction } from '../../../Core/Lang/Instruction';
import { Icon } from '../Icon/Icon';
import { InstructionButtonRow } from '../InstructionRow/InstructionButtonRow';
import { InstructionRow } from '../InstructionRow/InstructionRow';

export function InstructionsPanel(props: {
    instructions: Instruction[];
    onAdd(): void;
    onChange(instructions: Instruction[]): void;
}): JSX.Element {
    function handleInstructionChange(index: number, instruction: Instruction): void {
        const newInstructions = [...props.instructions];
        newInstructions[index] = instruction;
        props.onChange(newInstructions);
    }

    function handleInstructionDelete(index: number): void {
        const newInstructions = props.instructions.toSpliced(index, 1);
        props.onChange(newInstructions);
    }

    return (
        <div className={'instructions-panel'}>
            <div className={'instructions-panel-label'}>
                <Icon name={'Code'} />
                <label htmlFor={'instruction-list'}>Instructions</label>
            </div>
            <div id={'instruction-list'} className={'instruction-list'}>
                {
                    props.instructions.map((instruction, index) => (
                        <InstructionRow
                            key={index}
                            index={index}
                            instruction={instruction}
                            onChange={(newInstruction) => handleInstructionChange(index, newInstruction)}
                            onDelete={() => handleInstructionDelete(index)}
                        />
                    ))
                }
                <InstructionButtonRow
                    index={props.instructions.length}
                    onAdd={() => props.onAdd()}
                />
            </div>
        </div>
    );
}
