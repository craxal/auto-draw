import { IconButton } from "../IconButton/IconButton";

export function InstructionButtonRow(props: {
    index: number;
    indent?: boolean;
    onAdd(): void;
}): JSX.Element {
    return (
        <div className={'instruction-row'}>
            <div className={'instruction-number'}>
                {props.index + 1}
            </div>
            <div className={'instruction-buttons'}>
                <IconButton icon={'Plus'} label={'Add new instruction'} onClick={() => props.onAdd()} />
            </div>
        </div>
    );
}