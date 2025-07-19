import { Service, Dict } from "koishi";
import { PluginManager } from "./plugin";
import { BlocklyVendor } from "./vendor";
declare module "koishi" {
    interface Context {
        blockly: BlocklyService;
    }
}
export declare class BlocklyService extends Service {
    manager: PluginManager;
    vendors: Dict<BlocklyVendor>;
    constructor(ctx: any);
    reload(restart?: boolean): Promise<void>;
    registerVendor(vendor: BlocklyVendor): Promise<void>;
}
