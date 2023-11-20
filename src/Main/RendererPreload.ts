import type * as monaco from 'monaco-editor';

import { ipcRenderer } from 'electron';
import { ContextMenuArgs } from '../Common/ContextMenu';

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

// workaround monaco-css not understanding the environment
// self.module = undefined;

amdRequire(['vs/editor/editor.main'], function (api: typeof monaco) {
    window.app = {
        monaco: api,
        saveFile(filepath: string, data: string): Promise<void> {
            return ipcRenderer.invoke('file-save', { filepath, data });
        },
        saveAsFile(data: string): Promise<{ filepath: string; } | null> {
            return ipcRenderer.invoke('file-save-as', { data });
        },
        openFile(): Promise<{ filepath: string, data: string; } | null> {
            return ipcRenderer.invoke('file-open');
        },
        openContextMenu(args: ContextMenuArgs): Promise<string | null> {
            return ipcRenderer.invoke('context-menu', args);
        },
    };
});
