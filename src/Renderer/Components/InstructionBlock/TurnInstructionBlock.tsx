import { Instruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';

export function TurnInstructionBlock(props: {
    instruction: TurnLeftInstruction | TurnRightInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange(props.instruction instanceof TurnLeftInstruction
            ? new TurnLeftInstruction(newAngle)
            : new TurnRightInstruction(newAngle)
        );
    }

    return (
        <div className={'instruction-block'}>
            {`Turn ${props.instruction instanceof TurnLeftInstruction ? 'left' : 'right'} `}
            <input
                type={'number'}
                min={-720}
                max={720}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)} />
            {'°'}
        </div>
    );
}
