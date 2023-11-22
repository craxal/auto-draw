import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';
import { EndFunctionToken, Token } from './Token';

export function EndFunctionInstructionBlock(props: {
    instruction: EndFunctionToken;
    onChange(instruction: Token): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onNameChange(value: string): void {
        props.onChange({ ...props.instruction, name: value });
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'Code'} />
            </button>
            {'Define function '}
            <input
                value={props.instruction.name}
                onChange={(e) => onNameChange(e.target.value)} />
        </>
    );
}
