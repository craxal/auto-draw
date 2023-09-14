import { Color } from '../../../Core/Color';
import { ArcLeftInstruction, ArcRightInstruction, Instruction, MoveForwardInstruction, PenColorInstruction, PenDownInstruction, PenUpInstruction, TurnLeftInstruction, TurnRightInstruction } from '../../../Core/Instruction';

export function InstructionBlock(props: {
    instruction: Instruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    switch (props.instruction.name) {
        case "penDown": return (
            <PenPositionBlock instruction={props.instruction} />
        );
        case "penUp": return (
            <PenPositionBlock instruction={props.instruction} />
        );
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
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "turnRight": return (
            <TurnInstructionBlock
                instruction={props.instruction as TurnRightInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "arcLeft": return (
            <ArcInstructionBlock
                instruction={props.instruction as ArcLeftInstruction}
                onChange={(instruction) => props.onChange(instruction)}
            />
        );
        case "arcRight": return (
            <ArcInstructionBlock
                instruction={props.instruction as ArcRightInstruction}
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

function PenPositionBlock(props: {
    instruction: PenDownInstruction | PenUpInstruction;
}): JSX.Element {
    const text = props.instruction instanceof PenDownInstruction
        ? "Place pen down"
        : "Pick pen up";

    return (
        <div className='instruction-block'>
            {text}
        </div>
    );
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
            {'Change color to '}
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
        <div className='instruction-block'>
            {`Turn ${props.instruction instanceof TurnLeftInstruction ? 'left' : 'right'} `}
            <input
                type='number'
                min={-180}
                max={180}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)}
            />
            {'°'}
        </div>
    );
}

function ArcInstructionBlock(props: {
    instruction: ArcLeftInstruction | ArcRightInstruction;
    onChange(instruction: Instruction): void;
}): JSX.Element {
    function onAngleChange(value: string): void {
        const newAngle = parseInt(value);
        props.onChange(props.instruction instanceof ArcLeftInstruction
            ? new ArcLeftInstruction(newAngle, props.instruction.radius)
            : new ArcRightInstruction(newAngle, props.instruction.radius)
        );
    }

    function onRadiusChange(value: string): void {
        const newRadius = parseInt(value);
        props.onChange(props.instruction instanceof ArcLeftInstruction
            ? new ArcLeftInstruction(props.instruction.angle.degrees, newRadius)
            : new ArcRightInstruction(props.instruction.angle.degrees, newRadius)
        );
    }

    return (
        <div className='instruction-block'>
            {`Arc ${props.instruction instanceof ArcLeftInstruction ? 'left' : 'right'} `}
            <input
                type='number'
                min={-180}
                max={180}
                step={1}
                value={props.instruction.angle.degrees}
                onChange={(e) => onAngleChange(e.target.value)}
            />
            {'° with radius '}
            <input
                type='number'
                min={0}
                max={10_000}
                step={1}
                value={props.instruction.radius}
                onChange={(e) => onRadiusChange(e.target.value)}
            />
        </div>
    );
}