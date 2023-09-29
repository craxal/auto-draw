import { ContextMenuArgs, ContextMenuItem } from "../Common/ContextMenu";
import { InternalMenuArgs, InternalMenuItem } from "../Main/ContextMenuManager";

declare global {
    interface Window {
        app: {
            openContextMenu(args: InternalMenuArgs): Promise<string | null>;
        }
    }
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
