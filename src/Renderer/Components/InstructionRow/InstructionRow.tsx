import { DragEvent } from 'react';
import { Instruction } from '../../../Core/Lang/Instruction';
import { match } from '../../../Core/Util/Match';
import { InstructionBlock } from '../InstructionBlock/InstructionBlock';

export function InstructionRow(props: {
    index: number;
    instruction: Instruction;
    dragDrop?: 'source' | 'target-before' | 'target-after';
    onChange(instruction: Instruction): void;
    onDelete(): void;
    onDragStart(event: DragEvent<HTMLDivElement>): void;
    onDragEnter(event: DragEvent<HTMLDivElement>): void;
}): JSX.Element {
    const dragDrop = match(props.dragDrop,
        ['source', 'drag-drop-source'],
        ['target-before', 'drag-drop-target-before'],
        ['target-after', 'drag-drop-target-after'],
        ''
    );
    const className = [
        'instruction-row',
        dragDrop,
    ].join(' ').trim();

    return (
        <div className={className}>
            <div className={'instruction-number'}>
                {props.index + 1}
            </div>
            <div className={'instruction-container'}>
                <InstructionBlock
                    instruction={props.instruction}
                    onChange={(instruction) => props.onChange(instruction)}
                    onDelete={() => props.onDelete()}
                    onDragStart={(e) => props.onDragStart(e)}
                    onDragEnter={(e) => props.onDragEnter(e)}
                />
            </div>
        </div>
    )
}