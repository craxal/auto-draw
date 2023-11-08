import { ipcRenderer } from 'electron';
import { ContextMenuArgs } from '../Common/ContextMenu';

window.app = {
    saveFile(filepath: string, data: string): Promise<void> {
        return ipcRenderer.invoke('file-save', { filepath, data });
    },
    saveAsFile(data: string): Promise<{ filepath: string } | null> {
        return ipcRenderer.invoke('file-save-as', { data });
    },
    openFile(): Promise<{ filepath: string, data: string } | null> {
        return ipcRenderer.invoke('file-open');
    },
    openContextMenu(args: ContextMenuArgs): Promise<string | null> {
        return ipcRenderer.invoke('context-menu', args);
    },
}