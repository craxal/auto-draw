import { Color } from '../../../Core/Color';
import { Instruction, PenColorInstruction } from '../../../Core/Instruction';

export function PenColorInstructionBlock(props: {
    instruction: PenColorInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onColorChange(value: string): void {
        const newColor = Color.fromHex(value);
        props.onChange(new PenColorInstruction(newColor));
    }

    return (
        <div className={'instruction-block'}>
            {'Change color to '}
            <input
                type={'color'}
                value={props.instruction.color.toHex()}
                onChange={(e) => onColorChange(e.target.value)} />
        </div>
    );
}
