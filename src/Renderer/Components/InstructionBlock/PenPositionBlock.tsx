import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';
import { PenDownToken, PenUpToken, Token } from './Token';

export function PenPositionBlock(props: {
    instruction: PenDownToken | PenUpToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    const text = props.instruction.type === 'penDown'
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
