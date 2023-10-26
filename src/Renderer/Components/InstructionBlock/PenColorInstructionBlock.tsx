import { PenColorToken, Token } from '../../../Core/Lang/Lexical/Token';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function PenColorInstructionBlock(props: {
    instruction: PenColorToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onColorChange(value: string): void {
        props.onChange({ ...props.instruction, color: value });
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'Palette'} />
            </button>
            {'Change color to '}
            <input
                type={'color'}
                value={props.instruction.color}
                onChange={(e) => onColorChange(e.target.value)} />
        </>
    );
}
