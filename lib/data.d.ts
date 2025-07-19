import { DataService } from "@koishijs/plugin-console";
import { Context } from "koishi";
import { BlocklyMenuItem } from "./index";
declare module '@koishijs/plugin-console' {
    namespace Console {
        interface Services {
            blockly: BlocklyProvider;
        }
    }
}
export declare class BlocklyProvider extends DataService<BlocklyMenuItem[]> {
    constructor(ctx: Context);
    get(): Promise<import("minato").FlatPick<import("./structure").BlocklyDocument, "id" | "uuid" | "name" | "enabled" | "edited">[]>;
}
export declare function initializeDatabase(ctx: any): Promise<void>;
