import { Context, Schema } from 'koishi';
export declare const name = "blockly";
export interface Config {
}
export declare const Config: Schema<Config>;
export declare const inject: {
    optional: string[];
    required: string[];
};
export declare function apply(ctx: Context): Promise<void>;
export * from './structure';
export * from "./data";
export * from "./plugin";
export * from "./service";
export * from "./static";
export * from './console';
export * from './transpiler';
export * from './vendor';
