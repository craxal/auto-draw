import { ArcLeftInstruction, ArcRightInstruction, Instruction, MoveForwardInstruction, PenColorInstruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';
import { match } from '../../../Core/Match';
import { Icon } from '../Icon/Icon';
import { ArcInstructionBlock } from './ArcInstructionBlock';
import { MoveForwardInstructionBlock } from './MoveForwardInstructionBlock';
import { PenColorInstructionBlock } from './PenColorInstructionBlock';
import { PenPositionBlock } from './PenPositionBlock';
import { TurnInstructionBlock } from './TurnInstructionBlock';

export function InstructionBlock(props: {
    instruction: Instruction;
    onChange(instruction: Instruction): void;
    onDelete(): void;
}): JSX.Element {
    const innerBlock = match(props.instruction.type,
        ['penDown', (
            <PenPositionBlock
                instruction={props.instruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['penUp', (
            <PenPositionBlock
                instruction={props.instruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['penColor', (
            <PenColorInstructionBlock
                instruction={props.instruction as PenColorInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['moveForward', (
            <MoveForwardInstructionBlock
                instruction={props.instruction as MoveForwardInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['turnLeft', (
            <TurnInstructionBlock
                instruction={props.instruction as TurnLeftInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['turnRight', (
            <TurnInstructionBlock
                instruction={props.instruction as TurnRightInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['arcLeft', (
            <ArcInstructionBlock
                instruction={props.instruction as ArcLeftInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        ['arcRight', (
            <ArcInstructionBlock
                instruction={props.instruction as ArcRightInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        )],
        (<></>)
    );

    return (
        <div className={'instruction-block'}>
            <div className={'handle'}>
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
