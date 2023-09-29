import { ipcRenderer } from "electron";
import { ContextMenuArgs } from "../Common/ContextMenu";

window.app = {
    openContextMenu(args: ContextMenuArgs): Promise<string | null> {
        return ipcRenderer.invoke('context-menu', args);
    },
}