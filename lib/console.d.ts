import { Context } from "koishi";
declare module '@koishijs/plugin-console' {
    interface Events {
        'create-blockly-block'(uuid?: string): Promise<number>;
        'save-blockly-block'(id: number, data: {
            body?: object;
            code?: string;
            name?: string;
        }): void;
        'load-blockly-block'(id: number): Promise<object>;
        'rename-blockly-block'(id: number, name: string): Promise<void>;
        'delete-blockly-block'(id: number): Promise<void>;
        'set-blockly-block-state'(id: number, enabled: boolean): Promise<void>;
        'get-all-blockly-blocks'(): Promise<any[]>;
    }
}
export declare function initializeConsoleApiBacked(ctx: Context): void;
