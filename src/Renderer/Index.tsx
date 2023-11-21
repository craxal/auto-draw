import type * as monaco from 'monaco-editor';
import * as ReactDOM from 'react-dom/client';
import { Token } from '../Core/Lang/Lexical/Token';
import { Shell } from './Components/Shell/Shell';

const path = require('path');
const amdLoader = require('monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;

function uriFromPath(...paths: string[]) {
    var pathName = path.resolve(path.join(...paths)).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}

amdRequire.config({
    baseUrl: uriFromPath(__dirname, '../../node_modules/monaco-editor/min')
});

window.addEventListener('load', async () => {
    window.app.monaco = await new Promise((resolve) => {
        amdRequire(['vs/editor/editor.main'], function (api: typeof monaco) {
            resolve(api);
        });
    });

    const reactRootElement = document.getElementById('react-root')!;
    const reactRoot = ReactDOM.createRoot(reactRootElement);
    const instructions: Token[] = [
        // { type: 'defineFunction', line: 0, name: 'Draw a heart', },
        // { type: 'penColor', line: 1, color: '#ff0000', },
        // { type: 'penDown', line: 2, },
        // { type: 'turnLeft', line: 3, angle: 45, },
        // { type: 'moveForward', line: 4, distance: 50, },
        // { type: 'arcRight', line: 5, angle: 180, radius: 25, },
        // { type: 'turnLeft', line: 6, angle: 90, },
        // { type: 'arcRight', line: 7, angle: 180, radius: 25, },
        // { type: 'moveForward', line: 8, distance: 50, },
        // { type: 'turnRight', line: 9, angle: 135, },
        // { type: 'endFunction', line: 10, name: 'Draw a heart', },

        // { type: 'penColor', line: 11, color: '#0000ff', },
        // { type: 'penDown', line: 12, },
        // { type: 'moveForward', line: 13, distance: 100, },
        // { type: 'turnRight', line: 14, angle: 90, },
        // { type: 'moveForward', line: 15, distance: 90, },
        // { type: 'turnRight', line: 16, angle: 90, },
        // { type: 'moveForward', line: 17, distance: 80, },
        // { type: 'turnRight', line: 18, angle: 90, },
        // { type: 'moveForward', line: 19, distance: 70, },
        // { type: 'turnRight', line: 20, angle: 90, },
        // { type: 'moveForward', line: 21, distance: 60, },
        // { type: 'turnRight', line: 22, angle: 120, },
        // { type: 'moveForward', line: 23, distance: 50, },
        // { type: 'penColor', line: 24, color: '#ff0000', },
        // { type: 'arcRight', line: 25, angle: 135, radius: 40, },
        // { type: 'moveForward', line: 26, distance: 30, },
        // { type: 'arcLeft', line: 27, angle: 135, radius: 40, },
        // { type: 'callFunction', line: 28, name: 'Draw a heart', },
        // { type: 'moveForward', line: 29, distance: 50, },
        // { type: 'callFunction', line: 30, name: 'Draw a heart', },
        // { type: 'moveForward', line: 31, distance: 50, },
        // { type: 'callFunction', line: 32, name: 'Draw a circle', },

        // { type: 'defineFunction', line: 33, name: 'Draw a circle', },
        // { type: 'penUp', line: 34, },
        // { type: 'turnRight', line: 35, angle: 90, },
        // { type: 'moveForward', line: 36, distance: 50, },
        // { type: 'turnLeft', line: 37, angle: 90, },
        // { type: 'penColor', line: 38, color: '#7f00ff', },
        // { type: 'penDown', line: 39, },
        // { type: 'arcLeft', line: 40, angle: 360, radius: 50, },
        // { type: 'penUp', line: 41, },
        // { type: 'turnLeft', line: 42, angle: 90, },
        // { type: 'moveForward', line: 43, distance: 50, },
        // { type: 'turnRight', line: 44, angle: 90, },
        // { type: 'endFunction', line: 45, name: 'Draw a circle', },
        { type: 'endProgram', line: 46, },
    ];

    reactRoot.render(<Shell instructions={instructions} />);
});
