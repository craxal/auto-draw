import { PenDownToken, PenUpToken, Token } from '../../../Core/Lang/Lexical/Token';
import { PenDownInstruction } from '../../../Core/Lang/Parser/PenDownInstruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function PenPositionBlock(props: {
    instruction: PenDownToken | PenUpToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    const text = props.instruction instanceof PenDownInstruction
        ? 'Place pen down'
        : 'Pick pen up';

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'Pen'} />
            </button>
            {text}
        </>
    );
}
