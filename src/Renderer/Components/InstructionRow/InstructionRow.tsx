import { Instruction } from '../../../Core/Lang/Instruction';
import { match } from '../../../Core/Util/Match';
import { InstructionBlock } from '../InstructionBlock/InstructionBlock';

export function InstructionRow(props: {
    index: number;
    instruction: Instruction;
    onChange(instruction: Instruction): void;
    onDelete(): void;
}): JSX.Element {
    return (
        <div className={'instruction-row'}>
            <div className={'instruction-number'}>
                {props.index + 1}
            </div>
            <div className={'instruction-container'}>
                <InstructionBlock
                    instruction={props.instruction}
                    onChange={(instruction) => props.onChange(instruction)}
                    onDelete={() => props.onDelete()}
                />
            </div>
        </div>
    )
}