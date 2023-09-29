import { Instruction, MoveForwardInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';

export function MoveForwardInstructionBlock(props: {
    instruction: MoveForwardInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onDistanceChange(value: string): void {
        const newDistance = parseInt(value);
        props.onChange(new MoveForwardInstruction(newDistance));
    }

    return (
        <>
            <Icon name={'ArrowUp'} />
            {'Move forward '}
            <input
                type={'number'}
                min={0}
                max={10000}
                step={1}
                value={props.instruction.distance}
                onChange={(e) => onDistanceChange(e.target.value)} />
            {' pixels'}
        </>
    );
}
