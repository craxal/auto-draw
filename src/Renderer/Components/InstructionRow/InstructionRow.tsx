import { DragEvent } from 'react';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { match } from '../../../Core/Util/Match';
import { InstructionBlock } from '../InstructionBlock/InstructionBlock';

export function InstructionRow(props: {
    index: number;
    instruction: Token;
    indent?: boolean;
    dragDrop?: 'source' | 'target-before' | 'target-after';
    current?: boolean;
    onAdd(index?: number): void;
    onChange(instruction: Token): void;
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
        !!props.current ? 'current' : '',
        dragDrop,
    ].join(' ').trim();

    return (
        <div className={className}>
            <div className={'instruction-symbol'}></div>
            <div className={'instruction-number'}>
                {props.index + 1}
            </div>
            <div className={'instruction-container'}>
                <div className={'level'} style={{ width: !!props.indent ? '24px' : undefined }}></div>
                <InstructionBlock
                    instruction={props.instruction}
                    index={props.index}
                    onAdd={(index) => props.onAdd(index)}
                    onChange={(instruction) => props.onChange(instruction)}
                    onDelete={() => props.onDelete()}
                    onDragStart={(e) => props.onDragStart(e)}
                    onDragEnter={(e) => props.onDragEnter(e)}
                />
            </div>
        </div>
    )
}