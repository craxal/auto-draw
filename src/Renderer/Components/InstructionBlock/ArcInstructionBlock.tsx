import { ArcLeftInstruction, ArcRightInstruction, Instruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function ArcInstructionBlock(props: {
    instruction: ArcLeftInstruction | ArcRightInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange(props.instruction instanceof ArcLeftInstruction
            ? new ArcLeftInstruction(newAngle, props.instruction.radius)
            : new ArcRightInstruction(newAngle, props.instruction.radius)
        );
    }

    function onRadiusChange(value: string): void {
        const newRadius = parseInt(value);
        props.onChange(props.instruction instanceof ArcLeftInstruction
            ? new ArcLeftInstruction(props.instruction.angle.degrees, newRadius)
            : new ArcRightInstruction(props.instruction.angle.degrees, newRadius)
        );
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={props.instruction instanceof ArcLeftInstruction ? 'RotateLeft' : 'RotateRight'} />
            </button>
            {`Arc ${props.instruction instanceof ArcLeftInstruction ? 'left' : 'right'} `}
            <input
                type={'number'}
                min={-720}
                max={720}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)} />
            {'° with radius '}
            <input
                type={'number'}
                min={0}
                max={10000}
                step={1}
                value={props.instruction.radius}
                onChange={(e) => onRadiusChange(e.target.value)} />
        </>
    );
}
