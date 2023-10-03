import { Color } from '../../../Core/Graphics/Color';
import { Instruction, PenColorInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';
import { openInstructionContextMenu } from './InstructionBlockMenu';

export function PenColorInstructionBlock(props: {
    instruction: PenColorInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onIconClick(): void {
        openInstructionContextMenu((instruction) => props.onChange(instruction));
    }

    function onColorChange(value: string): void {
        const newColor = Color.fromHex(value);
        props.onChange(new PenColorInstruction(newColor));
    }

    return (
        <>
            <button onClick={(_e) => onIconClick()}>
                <Icon name={'Palette'} />
            </button>
            {'Change color to '}
            <input
                type={'color'}
                value={props.instruction.color.toHex()}
                onChange={(e) => onColorChange(e.target.value)} />
        </>
    );
}
