import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';
import { MoveForwardToken, Token } from './Token';

export function MoveForwardInstructionBlock(props: {
    instruction: MoveForwardToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onDistanceChange(value: string): void {
        const newDistance = parseInt(value);
        props.onChange({ ...props.instruction, distance: newDistance });
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'ArrowUp'} />
            </button>
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
