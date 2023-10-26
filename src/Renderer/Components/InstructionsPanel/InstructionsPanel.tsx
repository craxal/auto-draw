import { DragEvent, useState } from 'react';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { InstructionRow } from '../InstructionRow/InstructionRow';

export function InstructionsPanel(props: {
    instructions: Token[];
    currentInstruction: number;
    onAdd(index?: number): void;
    onInstructionsChange(instructions: Token[]): void;
    onCurrentInstructionChange(index: number): void;
    onExecute(): void;
}): JSX.Element {
    const [dragDropSourceIndex, setDragDropSourceIndex] = useState<number | undefined>();
    const [dragDropTargetIndex, setDragDropTargetIndex] = useState<number | undefined>();

    // function handleBackClick(): void {
    //     props.onCurrentInstructionChange(props.currentInstruction - 1);
    // }

    // function handleForwardClick(): void {
    //     props.onCurrentInstructionChange(props.currentInstruction + 1);
    // }

    function handlePlayClick(): void {
        // props.onCurrentInstructionChange(props.instructions.length);
        props.onExecute();
    }

    function handleInstructionChange(index: number, instruction: Token): void {
        const newInstructions = [...props.instructions];
        newInstructions[index] = { ...instruction, line: index };
        props.onInstructionsChange(newInstructions);
    }

    function handleInstructionDelete(index: number): void {
        const newInstructions = props.instructions.toSpliced(index, 1);
        props.onInstructionsChange(newInstructions);
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
            props.onInstructionsChange(newInstructions);
        }
    }

    function getInstructionRows(): JSX.Element[] {
        const rows: JSX.Element[] = [];

        let level = 0;
        props.instructions.forEach((instruction, index) => {
            let dragDrop: 'source' | 'target-before' | 'target-after' | undefined;
            if (index === dragDropSourceIndex) {
                dragDrop = 'source';
            } else if (index === dragDropTargetIndex) {
                dragDrop = dragDropTargetIndex > dragDropSourceIndex! ? 'target-after' : 'target-before';
            }

            rows.push(
                <InstructionRow
                    key={index}
                    index={index}
                    indent={level > 0}
                    instruction={instruction}
                    dragDrop={dragDrop}
                    current={index === props.currentInstruction}
                    onAdd={(index) => props.onAdd(index)}
                    onChange={(newInstruction) => handleInstructionChange(index, newInstruction)}
                    onDelete={() => handleInstructionDelete(index)}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                />
            );

            if (instruction.type === 'defineFunction') {
                level++;
            } else if (instruction.type === 'endFunction') {
                level = Math.max(0, --level);
            }
        });

        return rows;
    }

    return (
        <div className={'instructions-panel'}>
            <div className={'instructions-panel-label'}>
                <Icon name={'Code'} />
                <label htmlFor={'instruction-list'}>Instructions</label>
                <IconButton icon={'Play'} onClick={() => handlePlayClick()} />
            </div>
            {/* <div className={'instruction-panel-execute'}>
                <IconButton icon={'BackwardStep'} onClick={() => handleBackClick()} />
                <IconButton icon={'ForwardStep'} onClick={() => handleForwardClick()} />
            </div> */}
            <div
                id={'instruction-list'}
                className={'instruction-list'}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
            >
                {
                    getInstructionRows()
                }
                {/* <InstructionButtonRow
                    index={props.instructions.length}
                    onAdd={() => props.onAdd()}
                /> */}
            </div>
        </div>
    );
}
