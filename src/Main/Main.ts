import { BrowserWindow, app, ipcMain } from 'electron';
import * as path from 'path';
import { ContextMenuArgs } from '../Common/ContextMenu';
import { openContextMenu } from './ContextMenuManager';

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
    mainWindow.webContents.openDevTools()
}

ipcMain.handle('context-menu', (e, args: ContextMenuArgs) => {
    return openContextMenu(args);
});

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
