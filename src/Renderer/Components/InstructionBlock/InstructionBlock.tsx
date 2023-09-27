import { ArcLeftInstruction, ArcRightInstruction, Instruction, MoveForwardInstruction, PenColorInstruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';
import { match } from '../../../Core/Match';
import { ArcInstructionBlock } from './ArcInstructionBlock';
import { MoveForwardInstructionBlock } from './MoveForwardInstructionBlock';
import { PenColorInstructionBlock } from './PenColorInstructionBlock';
import { PenPositionBlock } from './PenPositionBlock';
import { TurnInstructionBlock } from './TurnInstructionBlock';

export function InstructionBlock(props: {
    instruction: Instruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    const innerBlock = match(props.instruction.name,
        ['penDown', (
            <PenPositionBlock instruction={props.instruction} />
        )],
        ['penUp', (
            <PenPositionBlock instruction={props.instruction} />
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
                {innerBlock}
                <button>Delete</button>
            </div>
        </div>
    )

}
