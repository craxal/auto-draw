import { IconLoader } from './IconLoader';

const iconLoader = new IconLoader();

export function Icon(props: {
    name: string;
    className?: string;
}): JSX.Element {
    const className = [
        "icon",
        props.className ?? "",
    ].join(" ");

    return (
        <div className={className}>
            {iconLoader.getIcon(props.name)}
        </div>
    );
}

