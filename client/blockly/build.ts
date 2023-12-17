import WrapperTemplate from './template.js.tpl?raw'
import {javascriptGenerator} from "blockly/javascript";
import {deduplicate} from "cosmokit"
import {Workspace} from "blockly";
import {Dict, } from "cosmokit";
import {TemplateCodes} from "./template";

export function createWrapper(imports:Dict<any>, name="", using=[], apply=""){  
  let result = [...Object.entries(imports)].map(([i,j])=>  
      `import { ${j.join(', ')} } from "${i}"\n`  
    ).join("") +  
    WrapperTemplate  
    .replace(/\{\{name}}/g, name.replace(/"/g,"\\\"").replace(/\\/g,"\\\\"))  
    .replace(/\{\{using}}/g, JSON.stringify(using))  
    .replace(/\{\{apply}}/g, apply.split("\n").map(t=>"  "+t).join("\n"));  
  
  // 删除 export const using = [] 字段  
  result = result.replace(/export const using = \[\];?/, '');  
  
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

export function build(name,plugin_id,workspace:Workspace){
  let currentImportMap = {}
  const blocks = workspace.getAllBlocks(false)
  blocks.filter(b=>b['imports']).map(b=>b['imports']).forEach(t=>{
    [...Object.entries(t)].forEach(([i,j])=>{
      if(!currentImportMap[i]) currentImportMap[i] = []
      currentImportMap[i] = deduplicate([...currentImportMap[i],...j as any])
    })
  })
  const templates = [];
  blocks.filter(b=>b['template']).map(b=>b['template']).forEach(t=>{
    t.forEach(t=>{
      if(!templates.includes(t)) templates.push(t)
    })
  })

  let a = createWrapper(currentImportMap,name,[],templates.map(t=>TemplateCodes[t]+"\n").map(t=>t.replace('{{name}}',name).replace("{{plugin_id}}",plugin_id)).join("")+javascriptGenerator.workspaceToCode(workspace))
  return moveToFront(a)
}
