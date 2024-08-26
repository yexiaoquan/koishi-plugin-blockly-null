var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// external/blockly-null/src/index.ts
var src_exports = {};
__export(src_exports, {
  BlocklyProvider: () => BlocklyProvider,
  BlocklyService: () => BlocklyService,
  BlocklyVendorDataService: () => BlocklyVendorDataService,
  Config: () => Config,
  PluginManager: () => PluginManager,
  apply: () => apply,
  esModuleToCommonJs: () => esModuleToCommonJs,
  initializeConsoleApiBacked: () => initializeConsoleApiBacked,
  initializeDatabase: () => initializeDatabase,
  inject: () => inject,
  name: () => name,
  registerStaticFileRoute: () => registerStaticFileRoute,
  rewriteImport: () => rewriteImport
});
module.exports = __toCommonJS(src_exports);
var import_koishi3 = require("koishi");
var import_path2 = require("path");

// external/blockly-null/src/service.ts
var import_koishi2 = require("koishi");

// external/blockly-null/src/plugin.ts
var import_koishi = require("koishi");

// external/blockly-null/src/transpiler.ts
var RE_COMMENTS = /\/\*[^]*?\*\//g;
var RE_KEYWORD = /(\bdefault\s+)?\b(let|const|class|function(?:\s*\*)?)(\s+)(\*?\s*[$\w][$\w\s\d,.=]+)([^]*?)$/i;
var RE_EXPORT = /(^|\s+)export(?!\w)\s*(\{[^{}]*?\}.*?(?=;\n?|$)|[^]*?(?=[\n;]|$))/gi;
var RE_FROM = /\bfrom\s+(["'])([^"']*)\1/gi;
var RE_DF = /\bdefault(\s+as\s+(\w+))?\b/i;
var RE_AS = /\b(\w+)\s+as\s+(\w+)\b/gi;
function allVars(chunks) {
  if (typeof chunks === "string")
    return allVars(chunks.replace(/{|}/g, "").split(/\s*,\s*/).map((x) => x.trim()));
  return chunks.reduce((memo, text) => memo.concat(text.split(/\s*,\s*/).map((x) => x.trim())), []);
}
__name(allVars, "allVars");
function mapVars(tokens) {
  return tokens.replace(/[{\s}]+/g, "").split(",").reduce((memo, k) => Object.assign(memo, { [k.split(":")[0]]: k.split(":")[1] }), {});
}
__name(mapVars, "mapVars");
function rewriteExportBuilder(ctx, fn, x, f) {
  ctx = ctx || "module.exports";
  fn = fn || "require";
  x = x || "Object.assign";
  return (_, left, tokens) => {
    let prefix = `${left}${ctx}`;
    tokens = tokens.replace(RE_COMMENTS, (_2) => _2.replace(/\S/g, " "));
    const symbols = tokens.match(RE_KEYWORD);
    if (symbols) {
      if (symbols[2] === "let" || symbols[2] === "const") {
        let vars = symbols[4].split("=").filter(Boolean);
        let last = "";
        if (vars.length !== 1) {
          last = vars[vars.length - 1];
          vars = vars.slice(0, vars.length - 1);
        }
        if (!symbols[4].includes("=") && symbols[4].includes(",")) {
          return `${left}${tokens};${symbols[2] === "let" && f ? f("let", allVars(vars), null, ctx, fn, x) : `${x}(${ctx},{${vars.join(",")}})`}`;
        }
        if (vars[0].includes(",")) {
          vars = vars[0].split(",");
        }
        return `${left}${symbols[2]}${symbols[3]}${vars.map((x2) => `${x2}=${ctx}.${x2.trim()}`).join("=void 0,")}=${last}${symbols[5]}`;
      }
      if (symbols[2] === "class" || symbols[2].includes("function")) {
        prefix = prefix.replace(left, `${left}const ${symbols[4].split(/[({\s]+/)[0].replace("*", "")}=`);
      }
      if (!symbols[1]) {
        prefix += `.${symbols[4].trim().replace("*", "")}`;
      }
    }
    const def = tokens.match(RE_DF);
    if (tokens.match(RE_FROM)) {
      const vars = tokens.replace(RE_AS, "$2").replace(RE_FROM, "").replace(/\s+/g, "");
      let mod;
      tokens = tokens.replace(RE_FROM, (_2, q, src) => `=${fn}("${mod = src}")`);
      tokens = tokens.replace(RE_AS, "$1:$2");
      const req = tokens.split("=").pop().trim();
      if (vars === "*") {
        return `${prefix}=${f ? f("*", req, mod, ctx, fn, x) : req}`;
      }
      if (def) {
        if (def[2]) {
          prefix += `.${def[2]}`;
        }
        return `${prefix}=${f ? f("default", req, mod, ctx, fn, x) : req}`;
      }
      return `${left}const ${tokens};${f ? f("const", allVars(vars), mod, ctx, fn, x) : `${x}(${ctx},${vars})`}`;
    }
    if (def) {
      if (symbols || !tokens.match(RE_AS)) {
        tokens = tokens.replace(RE_DF, "").trim();
      } else {
        tokens = tokens.match(RE_AS)[0].split(" ").shift();
      }
    } else {
      tokens = tokens.replace(RE_AS, "$2:$1");
    }
    if (!def && tokens.charAt() === "{") {
      if (tokens.includes("}")) {
        return `${left}${f ? f("object", mapVars(tokens), null, ctx, fn, x) : `${x}(${ctx},${tokens.replace(/\s+/g, "")})`}`;
      }
      return `${left}${ctx}=${tokens}`;
    }
    return `${prefix}=${tokens}`;
  };
}
__name(rewriteExportBuilder, "rewriteExportBuilder");
var rewriteExport = /* @__PURE__ */ __name((code, ctx, fn, x, i) => code.replace(RE_EXPORT, rewriteExportBuilder(ctx, fn, x, i)), "rewriteExport");
function destruct(keys, target) {
  var out = [];
  while (keys.length)
    out.push(keys.shift().trim().replace(/ as /g, ":"));
  return "const { " + out.join(", ") + " } = " + target;
}
__name(destruct, "destruct");
function generate(keys, dep, base) {
  if (keys.length && !base)
    return destruct(keys, dep);
  return "const " + base + " = " + dep + (keys.length ? ";\n" + destruct(keys, base) : "");
}
__name(generate, "generate");
function rewriteImport(str, fn) {
  fn = fn || "require";
  return str.replace(/(^|;\s*|\r?\n+)import\s*((?:\*\s*as)?\s*([a-z$_][\w$]*)?\s*,?\s*(?:{([\s\S]*?)})?)?\s*(from)?\s*(['"`][^'"`]+['"`])(?=;?)(?=([^"'`]*["'`][^"'`]*["'`])*[^"'`]*$)/gi, function(raw, ws, _, base, req, fro, dep) {
    dep = fn + "(" + dep + ")";
    return (ws || "") + (fro ? generate(req ? req.split(",") : [], dep, base) : dep);
  });
}
__name(rewriteImport, "rewriteImport");
function esModuleToCommonJs(code) {
  return rewriteImport(rewriteExport(code));
}
__name(esModuleToCommonJs, "esModuleToCommonJs");

// external/blockly-null/src/plugin.ts
var _PluginManager = class _PluginManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.restart();
    this.logger = this.ctx.logger("blockly");
  }
  plugins = [];
  runningPlugins = [];
  logger;
  restart() {
    var _a;
    this.runningPlugins.forEach((t) => t.dispose());
    this.runningPlugins = [];
    if (this.plugins.length == 0) {
      (_a = this.logger) == null ? void 0 : _a.info("No plugin loaded");
      return;
    }
    this.logger.info("Loading " + this.plugins.length + " plugin(s)");
    this.plugins.forEach((p) => {
      let context = {};
      context.module = {
        exports: {}
      };
      context.require = require;
      context.segment = import_koishi.segment;
      let plugin = null;
      try {
        const code = `const {${Object.keys(context).join(",")}} = this;${esModuleToCommonJs(p)}`;
        const pluginFunction = new Function(code);
        pluginFunction.call(context);
        plugin = context.module.exports;
      } catch (e) {
        this.ctx.logger("blockly").warn(e);
      }
      if (plugin && plugin["apply"])
        this.runningPlugins.push(this.ctx.plugin(plugin));
    });
    this.logger.info("Loaded " + this.runningPlugins.length + " plugin(s)");
  }
};
__name(_PluginManager, "PluginManager");
var PluginManager = _PluginManager;

// external/blockly-null/src/service.ts
var _BlocklyService = class _BlocklyService extends import_koishi2.Service {
  manager;
  vendors = {};
  constructor(ctx) {
    super(ctx, "blockly");
    this.manager = new PluginManager(ctx);
  }
  async reload(restart) {
    if (restart) {
      this.manager.plugins = (await this.ctx.database.get("blockly", { enabled: true }, ["code", "enabled"])).filter((t) => t.enabled).map((t) => t.code);
      this.manager.restart();
    }
    if (this.ctx["console.blockly"]) {
      await this.ctx["console.blockly"].refresh();
    }
  }
  async registerVendor(vendor) {
    this.vendors[vendor.id] = vendor;
    if (this.ctx["console.blockly_console"]) {
      await this.ctx["console.blockly_console"].patch(Object.fromEntries([[vendor.id, vendor]]));
    }
  }
};
__name(_BlocklyService, "BlocklyService");
var BlocklyService = _BlocklyService;

// external/blockly-null/src/data.ts
var import_plugin_console = require("@koishijs/plugin-console");
var import_uuid = require("uuid");
var _BlocklyProvider = class _BlocklyProvider extends import_plugin_console.DataService {
  constructor(ctx) {
    super(ctx, "blockly");
  }
  async get() {
    return await this.ctx.database.get("blockly", { id: { $not: -1 } }, ["id", "name", "enabled", "edited", "uuid"]);
  }
};
__name(_BlocklyProvider, "BlocklyProvider");
var BlocklyProvider = _BlocklyProvider;
async function initializeDatabase(ctx) {
  ctx.database.extend("blockly", {
    id: "integer",
    name: "string",
    body: "text",
    code: "text",
    enabled: "boolean",
    edited: "boolean",
    uuid: "string"
  }, {
    autoInc: true
  });
  const blocks = await ctx.database.get("blockly", { id: { $not: -1 } });
  const logger = ctx.logger("blockly");
  for (const block of blocks) {
    if (!block.uuid) {
      const uuid = (0, import_uuid.v4)();
      logger.info(`block ${block.id} has no uuid ->  ${uuid}`);
      await ctx.database.set("blockly", block.id, { uuid });
    }
  }
}
__name(initializeDatabase, "initializeDatabase");

// external/blockly-null/src/console.ts
var import_uuid2 = require("uuid");
function initializeConsoleApiBacked(ctx) {
  ctx.console.addListener("load-blockly-block", async (id) => {
    return JSON.parse((await ctx.database.get("blockly", id, ["body"]))[0].body);
  }, { authority: 5 });
  ctx.console.addListener("save-blockly-block", async (id, data) => {
    const save_object = {};
    if (data.body)
      save_object["body"] = JSON.stringify(data.body);
    if (data.code)
      save_object["code"] = data.code;
    if (data.name)
      save_object["name"] = data.name;
    save_object["edited"] = !data.code;
    await ctx.database.set("blockly", id, save_object);
    setTimeout(() => ctx.blockly.reload(!!data.code), 0);
  }, { authority: 5 });
  ctx.console.addListener("rename-blockly-block", async (id, name2) => {
    await ctx.database.set("blockly", id, { name: name2 });
    await ctx.blockly.reload();
  }, { authority: 5 });
  ctx.console.addListener("rename-blockly-block", async (id, name2) => {
    await ctx.database.set("blockly", id, { name: name2 });
    await ctx.blockly.reload();
  }, { authority: 5 });
  ctx.console.addListener("delete-blockly-block", async (id) => {
    await ctx.database.remove("blockly", { id });
    await ctx.blockly.reload();
  }, { authority: 5 });
  ctx.console.addListener("create-blockly-block", async (uuid) => {
    if (uuid) {
      const blocks = await ctx.database.get("blockly", { uuid }, ["id"]);
      if (blocks.length > 0)
        return blocks[0].id;
    }
    const data = await ctx.database.create("blockly", {
      name: "未命名Koishi代码",
      code: "",
      body: "{}",
      enabled: false,
      edited: false,
      uuid: uuid != null ? uuid : (0, import_uuid2.v4)()
    });
    await ctx.blockly.reload();
    return data.id;
  }, { authority: 5 });
  ctx.console.addListener("set-blockly-block-state", async (id, enabled) => {
    await ctx.database.set("blockly", id, { enabled });
    await ctx.blockly.reload(true);
  }, { authority: 5 });
}
__name(initializeConsoleApiBacked, "initializeConsoleApiBacked");

// external/blockly-null/src/static.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
function registerStaticFileRoute(ctx) {
  ctx.server.get(/\/static\/blockly\/([a-z0-9-]+.[a-z0-9]+)/, async function(ctx2) {
    const resource_path = import_path.default.resolve(__dirname, "../media/" + ctx2.params[0]);
    if (import_path.default.relative(import_path.default.resolve(__dirname + "/../"), resource_path).startsWith("..")) {
      return;
    }
    if (!import_fs.default.existsSync(resource_path)) {
      return;
    }
    ctx2.body = await import_fs.default.promises.readFile(resource_path);
  });
}
__name(registerStaticFileRoute, "registerStaticFileRoute");

// external/blockly-null/src/vendor.ts
var import_plugin_console2 = require("@koishijs/plugin-console");
var _BlocklyVendorDataService = class _BlocklyVendorDataService extends import_plugin_console2.DataService {
  constructor(ctx) {
    super(ctx, "blockly_vendors");
  }
  async get() {
    return this.ctx.blockly.vendors;
  }
};
__name(_BlocklyVendorDataService, "BlocklyVendorDataService");
var BlocklyVendorDataService = _BlocklyVendorDataService;

// external/blockly-null/src/index.ts
var name = "blockly";
var Config = import_koishi3.Schema.object({});
var inject = {
  optional: ["blockly", "console.blockly", "puppeteer"],
  required: ["database", "console", "server"]
};
async function apply(ctx) {
  ctx.plugin(BlocklyService);
  ctx.plugin(BlocklyProvider);
  ctx.inject(["blockly"], () => ctx.plugin(BlocklyVendorDataService));
  await initializeDatabase(ctx);
  ctx.inject(["console", "blockly", "server"], (ctx2) => {
    ctx2.console.addEntry({
      dev: (0, import_path2.resolve)(__dirname, "../client/index.ts"),
      prod: (0, import_path2.resolve)(__dirname, "../dist")
    });
    ctx2.blockly.reload(true);
  });
  initializeConsoleApiBacked(ctx);
  registerStaticFileRoute(ctx);
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlocklyProvider,
  BlocklyService,
  BlocklyVendorDataService,
  Config,
  PluginManager,
  apply,
  esModuleToCommonJs,
  initializeConsoleApiBacked,
  initializeDatabase,
  inject,
  name,
  registerStaticFileRoute,
  rewriteImport
});
