import { ArcLeftToken, ArcRightToken, Token } from '../../../Core/Lang/Lexical/Token';
import { ArcLeftInstruction } from '../../../Core/Lang/Parser/ArcLeftInstruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function ArcInstructionBlock(props: {
    instruction: ArcLeftToken | ArcRightToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange({ ...props.instruction, angle: newAngle });
    }

    function onRadiusChange(value: string): void {
        const newRadius = parseInt(value);
        props.onChange({ ...props.instruction, radius: newRadius });
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={props.instruction instanceof ArcLeftInstruction ? 'RotateLeft' : 'RotateRight'} />
            </button>
            {`Arc ${props.instruction.type === 'arcLeft' ? 'left' : 'right'} `}
            <input
                type={'number'}
                min={-720}
                max={720}
                step={1}
                value={props.instruction.angle}
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
