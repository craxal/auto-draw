import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Fragment, createElement } from 'react';
import { Log } from '../../../Core/Util/Log';
import { match } from '../../../Core/Util/Match';

type ElementNodeMemo = {
    tagName: string;
    attributes: { [index: string]: string };
    children: IconMemo[];
};
type TextNodeMemo = {
    text: string;
};
type IconMemo = ElementNodeMemo | TextNodeMemo;

const pathToIconResources = join(__dirname, '..', '..', '..', 'Resources');
const undefinedIcon = (
    <svg xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 512 512'}>
        <path d={'M64 390.3L153.5 256 64 121.7V390.3zM102.5 448H281.5L192 313.7 102.5 448zm128-192L320 390.3V121.7L230.5 256zM281.5 64H102.5L192 198.3 281.5 64zM0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48z'} />
    </svg>
);

export class IconLoader {
    #memos = new Map<string, IconMemo | undefined>();

    public getIcon(name: string): JSX.Element {
        try {
            const memo = this.#getMemo(name);
            return !!memo ? this.#getIconInstance(memo) : undefinedIcon;
        } catch (error) {
            Log.error('Icon load error:', error);
            return undefinedIcon;
        }
    }

    #getMemo(name: string): IconMemo | undefined {
        const memo = this.#memos.get(name)
            ?? this.#createMemo(readFileSync(join(pathToIconResources, `${name}.svg`)).toString());
        this.#memos.set(name, memo);

        return memo;
    }

    #createMemo(data: string): IconMemo | undefined {
        function toMemo(node: Node): IconMemo | undefined {
            if (node.nodeType === Node.TEXT_NODE) {
                return { text: node.nodeValue?.trim() ?? '' };
            } else {
                const element = node as Element;
                const memo: IconMemo = { tagName: element.tagName, attributes: {}, children: [] };

                for (const childElement of element.childNodes) {
                    const childMemo = toMemo(childElement);
                    if (!!childMemo) {
                        memo.children.push(childMemo);
                    }
                }

                for (const attribute of element.attributes) {
                    if (!!attribute.value) {
                        memo.attributes[attribute.name] = attribute.value;
                    }
                }

                return memo;
            }
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'image/svg+xml');
        const errorElement = doc.querySelector('parsererror div');
        if (!!errorElement) {
            throw new Error(errorElement.textContent ?? undefined);
        }

        const svgElement = doc.querySelector('svg:root');
        if (!svgElement) {
            throw new Error('Icon does not contain a root <svg> element');
        }

        Log.debug('Create memo for:', data);

        return toMemo(svgElement);
    }

    #getIconInstance(memo: IconMemo): JSX.Element {
        function toElement(memo: IconMemo, key?: number): JSX.Element {
            if ('text' in memo) {
                return (<Fragment key={key}>{memo.text}</Fragment>);
            } else {
                const children = memo.children.map((child, index) => toElement(child, index));
                const props: any = { key };
                for (const attribute in memo.attributes) {
                    const propName = match(
                        attribute,
                        ['class', 'className'],
                        ['for', 'htmlFor'],
                        attribute.replace(/(-[a-z])/g, (group) => group.replace('-', '').toUpperCase())
                    );
                    props[propName] = memo.attributes[attribute];
                }

                return createElement(memo.tagName, props, children);
            }
        }

        const memoInstance = this.#getMemoInstance(memo);

        return toElement(memoInstance);
    }

    #getMemoInstance(memo: IconMemo): IconMemo {
        function instantiateMemo(
            memo: IconMemo,
            instanceId: string = randomUUID(),
            ids: Map<string, string> = new Map()
        ): IconMemo {
            if ('text' in memo) {
                return memo;
            }

            const memoInstance: ElementNodeMemo = {
                tagName: memo.tagName,
                attributes: {},
                children: []
            };

            for (const property in memo.attributes) {
                if (property === 'id') {
                    memoInstance.attributes.id = !!memo.attributes.id
                        ? `${instanceId}:${memo.attributes.id}`
                        : '';
                    ids.set(memo.attributes.id, memoInstance.attributes.id);
                } else {
                    memoInstance.attributes[property] =
                        memo.attributes[property].replace(/url\(#(.+)\)/, (_, id) => `url(#${ids.get(id) ?? id})`);
                }
            }

            memoInstance.children = memo.children.map((child) => instantiateMemo(child, instanceId, ids));

            return memoInstance;
        }

        return instantiateMemo(memo);
    }
}
