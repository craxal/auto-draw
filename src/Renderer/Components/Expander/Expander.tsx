import { ReactElement, useState } from "react";
import { Icon } from "../Icon/Icon";

type ExpanderProps = {
    id?: string;
    label: string;
    children: ReactElement | ReactElement[];
};

export const Expander: React.FunctionComponent<ExpanderProps> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const content = isExpanded
        ? (
            <div className={'expander-content'}>
                {props.children}
            </div>
        )
        : undefined;

    return (
        <div className={'expander'}>
            <button className={'expander-button'} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={'expander-button-content'}>
                    <div className={'expander-label'}>{props.label}</div>
                    <Icon name={isExpanded ? 'CircleChevronUp' : 'CircleChevronDown'} />
                </div>
            </button>
            {content}
        </div>
    )
};
