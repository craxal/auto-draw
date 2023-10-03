import { Icon } from "../Icon/Icon";

export function InstructionButtonRow(props: {
    index: number;
    onAdd(): void;
}): JSX.Element {
    return (
        <div className={'instruction-row'}>
            <div className={'instruction-number'}>
                {props.index + 1}
            </div>
            <div className={'instruction-buttons'}>
                <button onClick={(_e) => props.onAdd()}>
                    <div className={'button-contents'}>
                        <Icon name={'Plus'} />
                        <div className={'button-text'}>Add new instruction</div>
                    </div>
                </button>
            </div>
        </div>
    );
}