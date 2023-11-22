import { BrowserWindow, app, ipcMain } from 'electron';
import * as path from 'path';
import { ContextMenuArgs } from '../Common/ContextMenu';
import { openContextMenu } from './ContextMenuManager';
import { openFile, saveAsFile, saveFile } from './FileManager';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'RendererPreload.js')
        }
    });

    mainWindow.maximize();
    mainWindow.loadFile('./dist/Renderer/Index.html');
    // mainWindow.webContents.openDevTools();
}

ipcMain.handle('file-save', (_e, args: { filepath: string, data: string; }) => {
    return saveFile(args.filepath, args.data);
});

ipcMain.handle('file-save-as', (_e, args: { data: string; }) => {
    return saveAsFile(args.data);
});

ipcMain.handle('file-open', (_e) => {
    return openFile();
});

ipcMain.handle('context-menu', (_e, args: ContextMenuArgs) => {
    return openContextMenu(args);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
