import { PenDownInstruction, PenUpInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';

export function PenPositionBlock(props: {
    instruction: PenDownInstruction | PenUpInstruction;
}): JSX.Element {
    const text = props.instruction instanceof PenDownInstruction
        ? 'Place pen down'
        : 'Pick pen up';

    return (
        <>
            <Icon name={'Pen'} />
            {text}
        </>
    );
}
