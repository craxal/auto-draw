import { DrawContext } from '../../../Core/Graphics/DrawContext';
import { Interpreter } from '../../../Core/Lang/Interpreter/Interpreter';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { Canvas } from '../Canvas/Canvas';
import { InstructionsPanel } from '../InstructionsPanel/InstructionsPanel';
import { useShellContext } from './ShellContext';

export function Shell(props: {
    instructions: Token[],
}): JSX.Element {
    const context = useShellContext(props.instructions);
    // const [currentInstruction, setCurrentInstruction] = useState(context.lines.length);

    function render(drawContext: DrawContext): void {
        if (!!context.program) {
            const interpreter = new Interpreter(drawContext);
            interpreter.visitProgram(context.program);
        }
        // drawContext.execute(context.lines.slice(0, currentInstruction).map((line) => line.instruction));
    }

    function handleAdd(): void {
        context.setInstructions([...context.instructions, { type: 'moveForward', line: context.instructions.length, distance: 0 }])
    }

    function handleInstructionsChange(instructions: Token[]): void {
        context.setInstructions(instructions);
    }

    function handleCurrentInstructionChange(index: number): void {
        // setCurrentInstruction(Math.max(0, Math.min(index, context.instructions.length)));
    }

    return (
        <div className={'shell'}>
            <Canvas render={(context) => render(context)} />
            <InstructionsPanel
                instructions={context.instructions}
                currentInstruction={0}
                onAdd={() => handleAdd()}
                onInstructionsChange={(instructions) => handleInstructionsChange(instructions)}
                onCurrentInstructionChange={(index) => handleCurrentInstructionChange(index)}
                onExecute={() => context.parseInstructions()}
            />
        </div>
    );
}