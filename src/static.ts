
import { Context } from "koishi";
import path from "path";
import fs from "fs";

declare module 'koishi' {
  interface Context {
    server: any;
  }
}
export function registerStaticFileRoute(ctx: Context) {
  ctx.server.get(/\/static\/blockly\/([a-z0-9-]+.[a-z0-9]+)/, async function (ctx) {
    const resource_path = path.resolve(__dirname, '../media/' + ctx.params[0])
    if (path.relative(path.resolve(__dirname + '/../'), resource_path).startsWith('..')) {
      return
    }
    if (!fs.existsSync(resource_path)) {
      return
    }
    ctx.body = await fs.promises.readFile(resource_path)
  })
}
