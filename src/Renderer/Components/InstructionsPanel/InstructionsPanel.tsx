import { DragEvent, useState } from 'react';
import { Instruction } from '../../../Core/Lang/Instruction';
import { Icon } from '../Icon/Icon';
import { InstructionButtonRow } from '../InstructionRow/InstructionButtonRow';
import { InstructionRow } from '../InstructionRow/InstructionRow';

export function InstructionsPanel(props: {
    instructions: Instruction[];
    onAdd(): void;
    onChange(instructions: Instruction[]): void;
}): JSX.Element {
    const [dragDropSourceIndex, setDragDropSourceIndex] = useState<number | undefined>();
    const [dragDropTargetIndex, setDragDropTargetIndex] = useState<number | undefined>();

    function handleInstructionChange(index: number, instruction: Instruction): void {
        const newInstructions = [...props.instructions];
        newInstructions[index] = instruction;
        props.onChange(newInstructions);
    }

    function handleInstructionDelete(index: number): void {
        const newInstructions = props.instructions.toSpliced(index, 1);
        props.onChange(newInstructions);
    }

    function handleDragStart(event: DragEvent<HTMLDivElement>, index: number): void {
        setDragDropSourceIndex(index);
    }

    function handleDragEnter(event: DragEvent<HTMLDivElement>, index: number): void {
        setDragDropTargetIndex(index);

        event.preventDefault();
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    function handleDrop(event: DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        setDragDropSourceIndex(undefined);
        setDragDropTargetIndex(undefined);

        if (dragDropSourceIndex !== undefined && dragDropTargetIndex !== undefined) {
            const newInstructions = [...props.instructions];
            newInstructions.splice(dragDropTargetIndex, 0, newInstructions.splice(dragDropSourceIndex, 1)[0]);
            props.onChange(newInstructions);
        }
    }

    return (
        <div className={'instructions-panel'}>
            <div className={'instructions-panel-label'}>
                <Icon name={'Code'} />
                <label htmlFor={'instruction-list'}>Instructions</label>
            </div>
            <div
                id={'instruction-list'}
                className={'instruction-list'}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
            >
                {
                    props.instructions.map((instruction, index) => {
                        let dragDrop: 'source' | 'target-before' | 'target-after' | undefined;
                        if (index === dragDropSourceIndex) {
                            dragDrop = 'source';
                        } else if (index === dragDropTargetIndex) {
                            dragDrop = dragDropTargetIndex > dragDropSourceIndex! ? 'target-after' : 'target-before';
                        }

                        return (
                            <InstructionRow
                                key={index}
                                index={index}
                                instruction={instruction}
                                dragDrop={dragDrop}
                                onChange={(newInstruction) => handleInstructionChange(index, newInstruction)}
                                onDelete={() => handleInstructionDelete(index)}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                            />
                        );
                    })
                }
                <InstructionButtonRow
                    index={props.instructions.length}
                    onAdd={() => props.onAdd()}
                />
            </div>
        </div>
    );
}
