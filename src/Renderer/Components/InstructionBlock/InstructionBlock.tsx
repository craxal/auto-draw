import { DragEvent } from 'react';
import { ArcLeftToken, ArcRightToken, CallFunctionToken, DefineFunctionToken, MoveForwardToken, PenColorToken, PenDownToken, PenUpToken, Token, TurnLeftToken, TurnRightToken } from '../../../Core/Lang/Lexical/Token';
import { match } from '../../../Core/Util/Match';
import { Icon } from '../Icon/Icon';
import { ArcInstructionBlock } from './ArcInstructionBlock';
import { CallFunctionInstructionBlock } from './CallFunctionInstructionBlock';
import { DefineFunctionInstructionBlock } from './DefineFunctionInstructionBlock';
import { MoveForwardInstructionBlock } from './MoveForwardInstructionBlock';
import { PenColorInstructionBlock } from './PenColorInstructionBlock';
import { PenPositionBlock } from './PenPositionBlock';
import { TurnInstructionBlock } from './TurnInstructionBlock';

export function InstructionBlock(props: {
    instruction: Token;
    onChange(instruction: Token): void;
    onDelete(): void;
    onDragStart(event: DragEvent<HTMLDivElement>): void;
    onDragEnter(event: DragEvent<HTMLDivElement>): void;
}): JSX.Element {
    const innerBlock = match(props.instruction.type,
        ['penDown', (
            <PenPositionBlock
                instruction={props.instruction as PenDownToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['penUp', (
            <PenPositionBlock
                instruction={props.instruction as PenUpToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['penColor', (
            <PenColorInstructionBlock
                instruction={props.instruction as PenColorToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['moveForward', (
            <MoveForwardInstructionBlock
                instruction={props.instruction as MoveForwardToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['turnLeft', (
            <TurnInstructionBlock
                instruction={props.instruction as TurnLeftToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['turnRight', (
            <TurnInstructionBlock
                instruction={props.instruction as TurnRightToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['arcLeft', (
            <ArcInstructionBlock
                instruction={props.instruction as ArcLeftToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['arcRight', (
            <ArcInstructionBlock
                instruction={props.instruction as ArcRightToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['defineFunction', (
            <DefineFunctionInstructionBlock
                instruction={props.instruction as DefineFunctionToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['callFunction', (
            <CallFunctionInstructionBlock
                instruction={props.instruction as CallFunctionToken}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        (<></>)
    );

    return (
        <div
            className={'instruction-block'}
            draggable={true}
            onDragStart={(e) => props.onDragStart(e)}
            onDragEnter={(e) => props.onDragEnter(e)}
        >
            <div className={'handle'} >
                <Icon name={'GripVertical'} className='handle' />
            </div>
            {innerBlock}
            <div className={'spacer'} />
            <button onClick={(_e) => props.onDelete()}>
                <Icon name={'Trash'} />
            </button>
        </div>
    );
}
