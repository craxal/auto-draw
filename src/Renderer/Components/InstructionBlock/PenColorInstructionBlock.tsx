import { Color } from '../../../Core/Color';
import { Instruction, PenColorInstruction } from '../../../Core/Instruction';
import { Icon } from '../Icon/Icon';

export function PenColorInstructionBlock(props: {
    instruction: PenColorInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onColorChange(value: string): void {
        const newColor = Color.fromHex(value);
        props.onChange(new PenColorInstruction(newColor));
    }

    return (
        <>
            <Icon name={'Palette'} />
            {'Change color to '}
            <input
                type={'color'}
                value={props.instruction.color.toHex()}
                onChange={(e) => onColorChange(e.target.value)} />
        </>
    );
}
