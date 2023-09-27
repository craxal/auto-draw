import { PenDownInstruction, PenUpInstruction } from '../../../Core/Instruction';

export function PenPositionBlock(props: {
    instruction: PenDownInstruction | PenUpInstruction;
}): JSX.Element {
    const text = props.instruction instanceof PenDownInstruction
        ? 'Place pen down'
        : 'Pick pen up';

    return (
        <div className={'instruction-block'}>
            {text}
        </div>
    );
}
