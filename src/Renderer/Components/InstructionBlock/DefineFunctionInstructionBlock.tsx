import { DefineFunctionInstruction } from '../../../Core/Lang/DefineFunctionInstruction';
import { Instruction } from '../../../Core/Lang/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function DefineFunctionInstructionBlock(props: {
    instruction: DefineFunctionInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onNameChange(value: string): void {
        props.onChange(new DefineFunctionInstruction(value, props.instruction.instructions));
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'RectangleList'} />
            </button>
            {'Name instructions: '}
            <input
                value={props.instruction.name}
                onChange={(e) => onNameChange(e.target.value)} />
        </>
    );
}
