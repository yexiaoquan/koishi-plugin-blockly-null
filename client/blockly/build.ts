import WrapperTemplate from './template.js.tpl?raw'
import { javascriptGenerator } from "blockly/javascript";
import { deduplicate } from "cosmokit"
import { Workspace } from "blockly";
import { Dict, } from "cosmokit";
import { TemplateCodes } from "./template";

function fixForEachVariableNames(code: string): string {
  const forEachPattern = /for\s*\(\s*let\s+(_[A-F0-9_]+)_index\s+in\s+(_[A-F0-9_]+)_list\s*\)\s*\{[^}]*const\s+(_[A-F0-9_]+)\s*=/g;
  let match;
  const variableMap = new Map<string, string>();

  while ((match = forEachPattern.exec(code)) !== null) {
    const encodedVarName = match[3];
    const decodedVarName = decodeVariableName(encodedVarName);
    if (decodedVarName !== encodedVarName) {
      variableMap.set(decodedVarName, encodedVarName);
    }
  }

  let fixedCode = code;
  for (const [original, encoded] of variableMap) {
    fixedCode = fixedCode.replace(new RegExp(escapeRegExp(original), 'g'), encoded);
  }

  return fixedCode;
}

function decodeVariableName(encodedName: string): string {
  try {
    const withPercent = encodedName.replace(/_/g, '%');
    return decodeURIComponent(withPercent);
  } catch (e) {
    return encodedName;
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createWrapper(imports: Dict<any>, name = "", injects = [], apply = "") {
  let result = [...Object.entries(imports)].map(([i, j]) =>
    `import { ${j.join(', ')} } from "${i}"\n`
  ).join("") +
    WrapperTemplate
      .replace(/\{\{name}}/g, name.replace(/"/g, "\\\"").replace(/\\/g, "\\\\"))
      .replace(/\{\{apply}}/g, apply.split("\n").map(t => "  " + t).join("\n"));

  return result;
}

export function moveToFront(text: string): string {
  const lines: string[] = text.split('\n');
  const specialLines: string[] = []; // 用于存放以import或export const 开头的行  
  const otherLines: string[] = [];

  // 定义类型  
  enum LineType {
    Import,
    Export,
    Other
  }

  for (const line of lines) {
    const trimmedLine = line.trimLeft(); // 去除行开头的空格  
    const lineType: LineType = trimmedLine.startsWith('import') ? LineType.Import : trimmedLine.startsWith('export const') ? LineType.Export : LineType.Other;

    if (lineType === LineType.Import || lineType === LineType.Export) {
      specialLines.push(trimmedLine);
    } else {
      otherLines.push(line);
    }
  }

  // 根据类型进行排序，保持原始顺序  
  specialLines.sort((a, b) => {
    if (a.startsWith('import') && b.startsWith('export const')) {
      return 0; // 保持不变的顺序  
    } else if (a.startsWith('import')) {
      return -1; // 以import开头的行排在前面  
    } else if (b.startsWith('import')) {
      return 1; // 以export const 开头的行排在后面  
    } else {
      return 0; // 保持不变的顺序  
    }
  });

  const sortedText: string = specialLines.concat(otherLines).join('\n');
  return sortedText;
}

export function build(name, plugin_id, workspace: Workspace) {
  let currentImportMap = {};
  const blocks = workspace.getAllBlocks(false);

  // 处理 imports 属性
  blocks.filter(b => b['imports'])
    .forEach(b => {
      Object.entries(b['imports']).forEach(([key, value]) => {
        if (!currentImportMap[key]) currentImportMap[key] = [];
        currentImportMap[key] = deduplicate([...currentImportMap[key], ...value]);
      });
    });

  // 处理 template 属性
  const templates = blocks.filter(b => b['template'])
    .map(b => b['template'])
    .reduce((acc, t) => acc.concat(t), [])
    .filter((value, index, self) => self.indexOf(value) === index); // 去重

  // 处理 injects 属性
  const injects = blocks.filter(b => b['injects'])
    .map(b => b['injects'])
    .reduce((acc, t) => acc.concat(t), [])
    .filter((value, index, self) => self.indexOf(value) === index); // 去重
  console.log(injects)
  console.log(blocks)
  let generatedCode = javascriptGenerator.workspaceToCode(workspace);
  generatedCode = fixForEachVariableNames(generatedCode);

  let wrapperCode = createWrapper(currentImportMap, name, injects,
    templates.map(t => TemplateCodes[t] + "\n")
      .map(t => t.replace('{{name}}', name)
        .replace("{{plugin_id}}", plugin_id))
      .join("") + generatedCode);

  return moveToFront(wrapperCode);
}
