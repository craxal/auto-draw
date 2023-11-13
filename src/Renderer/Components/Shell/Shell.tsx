import { DrawContext } from '../../../Core/Graphics/DrawContext';
import { Interpreter2 } from '../../../Core/Lang/Interpreter2/Interpreter2';
import { Token } from '../../../Core/Lang/Lexical/Token';
import { Canvas } from '../Canvas/Canvas';
import { CodePanel } from '../CodePanel/CodePanel';
import { Expander } from '../Expander/Expander';
import { useShellContext } from './ShellContext';

export function Shell(props: {
    instructions: Token[],
}): JSX.Element {
    const context = useShellContext(props.instructions);
    // const [currentInstruction, setCurrentInstruction] = useState(context.lines.length);

    function render(drawContext: DrawContext): void {
        if (!!context.program) {
            const interpreter = new Interpreter2(drawContext);
            interpreter.visitProgram(context.program);
        }
        drawContext.drawCursor();
        // drawContext.execute(context.lines.slice(0, currentInstruction).map((line) => line.instruction));
    }

    function handleAdd(index: number = context.instructions.length): void {
        const newInstructions = context.instructions.toSpliced(index, 0, { type: 'moveForward', line: context.instructions.length, distance: 0 });
        context.setInstructions(newInstructions);
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
            {/* <InstructionsPanel
                instructions={context.instructions}
                currentInstruction={0}
                onAdd={(index) => handleAdd(index)}
                onInstructionsChange={(instructions) => handleInstructionsChange(instructions)}
                onCurrentInstructionChange={(index) => handleCurrentInstructionChange(index)}
                onExecute={() => context.parseInstructions()}
            /> */}
            <CodePanel
                sourceFilepath={context.sourceFilepath}
                sourceText={context.sourceText}
                onSourceTextChange={(text) => context.setSourceText(text)}
                onOpen={() => context.openFile()}
                onSave={() => context.saveFile()}
                onSaveAs={() => context.saveAsFile()}
                onExecute={() => context.execute()}
            />
            <Expander label={'Console'}>
                <div className={'console'}>
                    <textarea value={context.console} readOnly={true} rows={10} />
                </div>
            </Expander>
        </div>
    );
}