import { CallFunctionInstruction } from '../../../Core/Lang/CallFunctionInstruction';
import { Instruction } from '../../../Core/Lang/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function CallFunctionInstructionBlock(props: {
    instruction: CallFunctionInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onNameChange(value: string): void {
        props.onChange(new CallFunctionInstruction(value));
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'Gears'} />
            </button>
            {'Follow instructions for: '}
            <input
                value={props.instruction.name}
                onChange={(e) => onNameChange(e.target.value)} />
        </>
    );
}
