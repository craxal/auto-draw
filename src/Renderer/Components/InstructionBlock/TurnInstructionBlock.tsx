import { Instruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function TurnInstructionBlock(props: {
    instruction: TurnLeftInstruction | TurnRightInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange(props.instruction instanceof TurnLeftInstruction
            ? new TurnLeftInstruction(newAngle)
            : new TurnRightInstruction(newAngle)
        );
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={props.instruction instanceof TurnLeftInstruction ? 'ArrowLeft' : 'ArrowRight'} />
            </button>
            {`Turn ${props.instruction instanceof TurnLeftInstruction ? 'left' : 'right'} `}
            <input
                type={'number'}
                min={-720}
                max={720}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)} />
            {'°'}
        </>
    );
}
