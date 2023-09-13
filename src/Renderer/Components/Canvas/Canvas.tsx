import * as React from 'react';
import { DrawContext } from '../../../Core/DrawContext';
import { Log } from '../../../Core/Log';

export function Canvas(props: {
    render: (context: DrawContext) => void;
}): JSX.Element {
    const canvasElementRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const elementContext = canvasElementRef.current?.getContext('2d');
        if (!!elementContext) {
            const context = new DrawContext(elementContext);
            props.render(context);
        }
    });

    React.useLayoutEffect(() => {
        if (!!canvasElementRef.current) {
            const clientRect = canvasElementRef.current.getBoundingClientRect();
            Log.debug(`Canvas resize from (${canvasElementRef.current.width} x ${canvasElementRef.current.height}) to (${clientRect.width} x ${clientRect.height})`)
            canvasElementRef.current.width = clientRect.width;
            canvasElementRef.current.height = clientRect.height;

        }
    })

    return (
        <canvas className="canvas" width={800} height={500} ref={canvasElementRef} />
    );
}