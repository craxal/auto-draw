import { ArcLeftInstruction } from '../../../Core/Lang/ArcLeftInstruction';
import { ArcRightInstruction } from '../../../Core/Lang/ArcRightInstruction';
import { Instruction } from "../../../Core/Lang/Instruction";
import { MoveForwardInstruction } from '../../../Core/Lang/MoveForwardInstruction';
import { PenColorInstruction } from '../../../Core/Lang/PenColorInstruction';
import { PenDownInstruction } from '../../../Core/Lang/PenDownInstruction';
import { PenUpInstruction } from '../../../Core/Lang/PenUpInstruction';
import { TurnLeftInstruction } from '../../../Core/Lang/TurnLeftInstruction';
import { TurnRightInstruction } from '../../../Core/Lang/TurnRightInstruction';
import { openContextMenu } from "../../AppWindow";

export async function openInstructionContextMenu(onChange: (instruction: Instruction) => void): Promise<void> {
    await openContextMenu({
        menu: [
            [
                { type: 'normal', id: 'moveForward', label: 'Move Forward', onClick: () => onChange(new MoveForwardInstruction()) },
            ],
            [
                { type: 'normal', id: 'turnLeft', label: 'Turn Left', onClick: () => onChange(new TurnLeftInstruction()) },
                { type: 'normal', id: 'turnRight', label: 'Turn Right', onClick: () => onChange(new TurnRightInstruction()) },
            ],
            [
                { type: 'normal', id: 'arcLeft', label: 'Arc Left', onClick: () => onChange(new ArcLeftInstruction()) },
                { type: 'normal', id: 'arcRight', label: 'Arc Right', onClick: () => onChange(new ArcRightInstruction()) },
            ],
            [
                { type: 'normal', id: 'penUp', label: 'Pen Up', onClick: () => onChange(new PenUpInstruction()) },
                { type: 'normal', id: 'penDown', label: 'Pen Down', onClick: () => onChange(new PenDownInstruction()) },
                { type: 'normal', id: 'penColor', label: 'Pen Color', onClick: () => onChange(new PenColorInstruction()) },
            ]
        ]
    });
}
