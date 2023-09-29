import { Menu } from "electron";

type CommonInternalMenuItem = {
    id: string;
    label: string;
    enabled?: boolean;
    visible?: boolean;
};

export type NormalInternalMenuItem = CommonInternalMenuItem & {
    type: 'normal';
};

export type CheckboxInternalMenuItem = CommonInternalMenuItem & {
    type: 'checkbox';
    checked?: boolean;
};

export type RadioInternalMenuItem = CommonInternalMenuItem & {
    type: 'radio';
    checked?: boolean;
};

export type SubmenuInternalMenuItem = CommonInternalMenuItem & {
    type: 'submenu',
    submenu: InternalMenuItem[];
};

export type InternalMenuItem =
    | NormalInternalMenuItem
    | CheckboxInternalMenuItem
    | RadioInternalMenuItem
    | SubmenuInternalMenuItem
    ;

export type InternalMenuArgs = {
    menu: InternalMenuItem[][];
    position?: { x: number; y: number; }
};

export function openContextMenu(args: InternalMenuArgs): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
        function toElectronMenuItems(menu: InternalMenuItem[]): Electron.MenuItemConstructorOptions[] {
            return menu.map((menuItem) => {
                switch (menuItem.type) {
                    case 'normal':
                    case 'checkbox':
                    case 'radio':
                        return { ...menuItem, click: () => resolve(menuItem.id) };
                    case 'submenu':
                        return { ...menuItem, submenu: toElectronMenuItems(menuItem.submenu) };
                }
            });
        }

        const menuItems = args.menu.flatMap<Electron.MenuItemConstructorOptions>((group) => [
            ...toElectronMenuItems(group),
            { type: 'separator' },
        ]);
        const menu = Menu.buildFromTemplate(menuItems);
        menu.popup({
            x: args.position?.x,
            y: args.position?.y,
            callback: () => resolve(null),
        });
    });
}