import { Context } from "koishi";
declare module 'koishi' {
    interface Context {
        server: any;
    }
}
export declare function registerStaticFileRoute(ctx: Context): void;
