import { Instruction, PenDownInstruction, PenUpInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function PenPositionBlock(props: {
    instruction: PenDownInstruction | PenUpInstruction;
    onChange(instruction: Instruction): void;
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
