import { Token, TurnLeftToken, TurnRightToken } from '../../../Core/Lang/Lexical/Token';
import { TurnLeftInstruction } from '../../../Core/Lang/Parser/TurnLeftInstruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function TurnInstructionBlock(props: {
    instruction: TurnLeftToken | TurnRightToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange({ ...props.instruction, angle: newAngle });
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={props.instruction instanceof TurnLeftInstruction ? 'ArrowLeft' : 'ArrowRight'} />
            </button>
            {`Turn ${props.instruction.type === 'turnLeft' ? 'left' : 'right'} `}
            <input
                type={'number'}
                min={-720}
                max={720}
                step={1}
                value={props.instruction.angle}
                onChange={(e) => onAngleChange(e.target.value)} />
            {'°'}
        </>
    );
}
