import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';
import { CallFunctionToken, Token } from './Token';

export function CallFunctionInstructionBlock(props: {
    instruction: CallFunctionToken;
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
            {'Call '}
            <input
                value={props.instruction.name}
                onChange={(e) => onNameChange(e.target.value)} />
        </>
    );
}
