import { dialog } from "electron";
import { readFile as nodeReadFile, writeFile as nodeWriteFile } from "fs/promises";

const filters: Electron.FileFilter[] = [
    { name: 'AutoDraw Source File', extensions: ['ad'] },
    { name: 'All Files', extensions: ['*'] }
];

export async function saveFile(filepath: string, data: string): Promise<void> {
    await nodeWriteFile(filepath, data);
}

export async function saveAsFile(data: string): Promise<{ filepath: string } | null> {
    const result = await dialog.showSaveDialog({ filters });
    const filepath = result.filePath;
    if (!!filepath) {
        await nodeWriteFile(filepath, data);

        return { filepath };
    } else {
        return null;
    }
}

export async function openFile(): Promise<{ filepath: string, data: string } | null> {
    const result = await dialog.showOpenDialog({ filters: filters, properties: ['openFile'] });
    const filepath = result.filePaths.at(0);
    if (!!filepath) {
        return { filepath, data: await nodeReadFile(filepath, { encoding: 'utf-8' }) };
    } else {
        return null;
    }
}
