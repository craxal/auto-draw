export type ArcLeftToken = { type: 'arcLeft'; line: number; angle: number; radius: number; };
export type ArcRightToken = { type: 'arcRight'; line: number; angle: number; radius: number; };
export type CallFunctionToken = { type: 'callFunction'; line: number; name: string; };
export type DefineFunctionToken = { type: 'defineFunction'; line: number; name: string; };
export type EndFunctionToken = { type: 'endFunction'; line: number; name: string; };
export type EndProgramToken = { type: 'endProgram'; line: number; };
export type MoveForwardToken = { type: 'moveForward'; line: number; distance: number; };
export type PenColorToken = { type: 'penColor'; line: number; color: string; };
export type PenDownToken = { type: 'penDown'; line: number; };
export type PenUpToken = { type: 'penUp'; line: number; };
export type TurnLeftToken = { type: 'turnLeft'; line: number; angle: number };
export type TurnRightToken = { type: 'turnRight'; line: number; angle: number; };

export type Token =
    | ArcLeftToken
    | ArcRightToken
    | CallFunctionToken
    | DefineFunctionToken
    | EndFunctionToken
    | EndProgramToken
    | MoveForwardToken
    | PenColorToken
    | PenDownToken
    | PenUpToken
    | TurnLeftToken
    | TurnRightToken
    ;
