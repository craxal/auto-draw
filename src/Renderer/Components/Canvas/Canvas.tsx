import * as React from 'react';
import { DrawContext } from '../../../Core/DrawContext';
import { Log } from '../../../Core/Log';

export function Canvas(props: {
    render: (context: DrawContext) => void;
}): JSX.Element {
    const canvasElementRef = React.useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = React.useState(800);
    const [height, setHeight] = React.useState(500);

    React.useLayoutEffect(() => {
        if (!!canvasElementRef.current) {
            const clientRect = canvasElementRef.current.getBoundingClientRect();
            Log.debug(`Canvas resize from (${canvasElementRef.current.width} x ${canvasElementRef.current.height}) to (${clientRect.width} x ${clientRect.height})`)
            canvasElementRef.current.width = clientRect.width;
            canvasElementRef.current.height = clientRect.height;

            const elementContext = canvasElementRef.current?.getContext('2d');
            if (!!elementContext) {
                const context = new DrawContext(elementContext);
                props.render(context);
            }
        }
    });

    React.useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            setWidth(entries[0].contentBoxSize[0].inlineSize);
            setHeight(entries[0].contentBoxSize[0].blockSize);
        });
        if (!!canvasElementRef.current) {
            observer.observe(canvasElementRef.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [width, height]);

    return (
        <canvas className={'canvas'} width={width} height={height} ref={canvasElementRef} />
    );
}