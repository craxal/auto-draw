import { Token } from "../../../Core/Lang/Lexical/Token";
import { openContextMenu } from "../../AppWindow";

export async function openInstructionContextMenu(onClick: (instruction: Token) => void): Promise<void> {
    await openContextMenu({
        menu: [
            [
                { type: 'normal', id: 'moveForward', label: 'Move Forward', onClick: () => onClick({ type: 'moveForward', line: 0, distance: 0 }) },
            ],
            [
                { type: 'normal', id: 'turnLeft', label: 'Turn Left', onClick: () => onClick({ type: 'turnLeft', line: 0, angle: 90 }) },
                { type: 'normal', id: 'turnRight', label: 'Turn Right', onClick: () => onClick({ type: 'turnRight', line: 0, angle: 90 }) },
            ],
            [
                { type: 'normal', id: 'arcLeft', label: 'Arc Left', onClick: () => onClick({ type: 'arcLeft', line: 0, angle: 90, radius: 20 }) },
                { type: 'normal', id: 'arcRight', label: 'Arc Right', onClick: () => onClick({ type: 'arcRight', line: 0, angle: 90, radius: 20 }) },
            ],
            [
                { type: 'normal', id: 'penUp', label: 'Pen Up', onClick: () => onClick({ type: 'penUp', line: 0 }) },
                { type: 'normal', id: 'penDown', label: 'Pen Down', onClick: () => onClick({ type: 'penDown', line: 0 }) },
                { type: 'normal', id: 'penColor', label: 'Pen Color', onClick: () => onClick({ type: 'penColor', line: 0, color: '#000000' }) },
            ],
            [
                { type: 'normal', id: 'defineFunction', label: 'Define function', onClick: () => onClick({ type: 'defineFunction', line: 0, name: "do something" }) },
                { type: 'normal', id: 'endFunction', label: 'End function', onClick: () => onClick({ type: 'endFunction', line: 0, name: "do something" }) },
                { type: 'normal', id: 'callFunction', label: 'Call function', onClick: () => onClick({ type: 'callFunction', line: 0, name: "do something" }) },
            ]
        ]
    });
}
