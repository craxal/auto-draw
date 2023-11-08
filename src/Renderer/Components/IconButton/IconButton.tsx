import { Icon } from '../Icon/Icon';

export function IconButton(props: {
    id?: string;
    className?: string;
    icon: string;
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
}): JSX.Element {
    const className = [
        'icon-button',
        props.className ?? ''
    ].join(' ').trim();

    return (
        <button id={props.id} className={className} disabled={props.disabled} onClick={(_e) => props.onClick?.()}>
            <div className={'icon-button-contents'}>
                <Icon name={props.icon} />
                {
                    props.label ? (<div className={'icon-button-text'}>{props.label}</div>) : (<></>)
                }
            </div>
        </button>
    );
}