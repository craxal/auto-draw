import { Color } from '../../../Core/Color';
import { Instruction, MoveForwardInstruction, PenColorInstruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';

export function InstructionBlock(props: {
    instruction: Instruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    switch (props.instruction.name) {
        case "penColor": return (
            <PenColorInstructionBlock
                instruction={props.instruction as PenColorInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "moveForward": return (
            <MoveForwardInstructionBlock
                instruction={props.instruction as MoveForwardInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "turnLeft": return (
            <TurnInstructionBlock
                instruction={props.instruction as TurnLeftInstruction}
                direction='left'
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "turnRight": return (
            <TurnInstructionBlock
                instruction={props.instruction as TurnRightInstruction}
                direction='right'
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        default: return (
            <div className='instruction-block'>
                {props.instruction.name}
            </div>
        );
    }
}

function PenColorInstructionBlock(props: {
    instruction: PenColorInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onColorChange(value: string): void {
        const newColor = Color.fromHex(value);
        props.onChange(new PenColorInstruction(newColor));
    }

    return (
        <div className='instruction-block'>
            {'Set pen color to '}
            <input
                type='color'
                value={props.instruction.color.toHex()}
                onChange={(e) => onColorChange(e.target.value)}
            />
        </div>
    );
}

function MoveForwardInstructionBlock(props: {
    instruction: MoveForwardInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onDistanceChange(value: string): void {
        const newDistance = parseInt(value);
        props.onChange(new MoveForwardInstruction(newDistance));
    }

    return (
        <div className='instruction-block'>
            {'Move forward '}
            <input
                type='number'
                min={0}
                max={10_000}
                step={1}
                value={props.instruction.distance}
                onChange={(e) => onDistanceChange(e.target.value)}
            />
            {' pixels'}
        </div>
    );
}

function TurnInstructionBlock(props: {
    instruction: TurnLeftInstruction | TurnRightInstruction;
    direction: "left" | "right";
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange(props.direction === "right"
            ? new TurnRightInstruction(newAngle)
            : new TurnLeftInstruction(newAngle)
        );
    }

    return (
        <div className='instruction-block'>
            {`Turn ${props.direction} `}
            <input
                type='number'
                min={-360}
                max={360}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)}
            />
            {'°'}
        </div>
    );
}
