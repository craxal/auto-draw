type CommonContextMenuItem = {
    id: string;
    label: string;
    enabled?: boolean;
    visible?: boolean;
};

export type NormalContextMenuItem = CommonContextMenuItem & {
    type: 'normal';
    onClick(): void;
};

export type CheckboxContextMenuItem = CommonContextMenuItem & {
    type: 'checkbox';
    checked?: boolean;
    onClick: () => void;
};

export type RadioContextMenuItem = CommonContextMenuItem & {
    type: 'radio';
    checked?: boolean;
    onClick: () => void;
};

export type SubmenuContextMenuItem = CommonContextMenuItem & {
    type: 'submenu',
    submenu: ContextMenuItem[];
};

export type ContextMenuItem =
    | NormalContextMenuItem
    | CheckboxContextMenuItem
    | RadioContextMenuItem
    | SubmenuContextMenuItem
    ;

export type ContextMenuArgs = {
    menu: ContextMenuItem[][];
    position?: { x: number; y: number; }
};