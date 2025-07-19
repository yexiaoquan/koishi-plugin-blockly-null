import { Context, ForkScope } from "koishi";
export declare class PluginManager {
    protected ctx: Context;
    plugins: string[];
    runningPlugins: ForkScope[];
    private logger;
    constructor(ctx: Context);
    restart(): void;
}
