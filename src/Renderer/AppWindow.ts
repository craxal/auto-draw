import { ContextMenuArgs, ContextMenuItem } from '../Common/ContextMenu';
import { InternalMenuArgs, InternalMenuItem } from '../Main/ContextMenuManager';

declare global {
    interface Window {
        app: {
            saveFile(filepath: string, data: string): Promise<void>;
            saveAsFile(data: string): Promise<{ filepath: string } | null>;
            openFile(): Promise<{ filepath: string, data: string } | null>;
            openContextMenu(args: InternalMenuArgs): Promise<string | null>;
        }
    }
}

export function saveFile(filepath: string, data: string): Promise<void> {
    return window.app.saveFile(filepath, data);
}

export function saveAsFile(data: string): Promise<{ filepath: string } | null> {
    return window.app.saveAsFile(data);
}

export function openFile(): Promise<{ filepath: string, data: string } | null> {
    return window.app.openFile();
}

export async function openContextMenu(args: ContextMenuArgs): Promise<void> {
    function toInternalMenuItems(menu: ContextMenuItem[]): InternalMenuItem[] {
        return menu.map((menuItem) => {
            switch (menuItem.type) {
                case 'normal':
                    return {
                        type: menuItem.type,
                        id: menuItem.id,
                        label: menuItem.label,
                        enabled: menuItem.enabled,
                        visible: menuItem.visible,
                    };
                case 'checkbox':
                case 'radio':
                    return {
                        type: menuItem.type,
                        id: menuItem.id,
                        label: menuItem.label,
                        enabled: menuItem.enabled,
                        visible: menuItem.visible,
                        checked: menuItem.checked,
                    };
                case 'submenu':
                    return {
                        type: menuItem.type,
                        id: menuItem.id,
                        label: menuItem.label,
                        enabled: menuItem.enabled,
                        visible: menuItem.visible,
                        submenu: toInternalMenuItems(menuItem.submenu),
                    };
            }
        });
    }

    const ipcMenu = args.menu.map((group) => toInternalMenuItems(group));

    const result = await window.app.openContextMenu({ menu: ipcMenu, position: args.position });

    if (!!result) {
        const submenus: ContextMenuItem[] = [...args.menu.flat()];
        while (submenus.length > 0) {
            const submenu = submenus.shift();
            if (submenu?.type === 'submenu') {
                submenus.push(submenu);
            } else if (submenu?.id === result) {
                submenu?.onClick();
                return;
            }
        }
    }
}
