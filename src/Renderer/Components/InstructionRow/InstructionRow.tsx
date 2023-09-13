import { Instruction } from '../../../Core/Instruction';
import { InstructionBlock } from '../InstructionBlock/InstructionBlock';

export function InstructionRow(props: {
    index: number;
    instruction: Instruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    return (
        <div className='instruction-row'>
            <div className='instruction-number'>
                {props.index + 1}
            </div>
            <div className='instruction-container'>
                <InstructionBlock instruction={props.instruction} onChange={(instruction) => props.onChange(instruction)} />
            </div>
        </div>
    )
}