import { Instruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';
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

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        const data = event.dataTransfer.getData('application/autodraw-instruction');
    }

    return (
        <div className={'instructions-panel'}>
            <div className={'instructions-panel-label'}>
                <Icon name={'Code'} />
                <label htmlFor={'instruction-list'}>Instructions</label>
            </div>
            <div id={'instruction-list'} className={'instruction-list'} onDragOver={(e) => handleDragOver(e)}>
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
            <button>
                Add
            </button>
        </div>
    );
}
