import { useState } from 'react';
import { Color } from '../../../Core/Graphics/Color';
import { ArcLeftInstruction } from '../../../Core/Lang/ArcLeftInstruction';
import { ArcRightInstruction } from '../../../Core/Lang/ArcRightInstruction';
import { Instruction } from '../../../Core/Lang/Instruction';
import { MoveForwardInstruction } from '../../../Core/Lang/MoveForwardInstruction';
import { PenColorInstruction } from '../../../Core/Lang/PenColorInstruction';
import { PenDownInstruction } from '../../../Core/Lang/PenDownInstruction';
import { TurnRightInstruction } from '../../../Core/Lang/TurnRightInstruction';
import { Canvas } from '../Canvas/Canvas';
import { InstructionsPanel } from '../InstructionsPanel/InstructionsPanel';

export function Shell(props: {
}): JSX.Element {
    const [instructions, setInstructions] = useState<Instruction[]>([
        new PenColorInstruction(Color.blue),
        new PenDownInstruction(),
        // new TurnRight(),
        new MoveForwardInstruction(100),
        new TurnRightInstruction(),
        new MoveForwardInstruction(90),
        new TurnRightInstruction(),
        new MoveForwardInstruction(80),
        new TurnRightInstruction(),
        new MoveForwardInstruction(70),
        new TurnRightInstruction(),
        new MoveForwardInstruction(60),
        new TurnRightInstruction(120),
        new MoveForwardInstruction(50),
        new PenColorInstruction(Color.red),
        new ArcRightInstruction(135, 40),
        new MoveForwardInstruction(30),
        new ArcLeftInstruction(135, 40),
        // new PenUp(),
    ]);

    function onAdd(): void {
        setInstructions([...instructions, new MoveForwardInstruction()])
    }

    function onChange(instructions: Instruction[]): void {
        setInstructions(instructions);
    }

    return (
        <div className={'shell'}>
            <Canvas render={(context) => context.execute(instructions)} />
            <InstructionsPanel
                instructions={instructions}
                onAdd={() => onAdd()}
                onChange={(instructions) => onChange(instructions)} />
        </div>
    );
}