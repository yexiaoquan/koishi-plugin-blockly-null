import { DataService } from "@koishijs/plugin-console";
import { Dict } from "koishi";
declare module '@koishijs/plugin-console' {
    namespace Console {
        interface Services {
            'blockly_vendors': BlocklyVendorDataService;
        }
    }
}
export interface BlockDefinition {
    type: string;
    definition: any;
}
export interface BlocklyVendor {
    id: string;
    blocks: BlockDefinition[];
}
export declare class BlocklyVendorDataService extends DataService<Dict<BlocklyVendor>> {
    constructor(ctx: any);
    get(): Promise<Dict<BlocklyVendor>>;
}
