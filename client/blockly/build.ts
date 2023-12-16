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

export function moveImportToFront(text: string): string {  
  const lines: string[] = text.split('\n');  
  const importLines: string[] = [];  
  const otherLines: string[] = [];  
  
  for (const line of lines) {  
    if (line.trim().startsWith('import')) {  
      // 如果行以import开头，去除空格后添加到importLines数组  
      importLines.push(line.trim().trimLeft()); // 添加trimLeft()去除行开头的空格  
    } else {  
      // 其他行保持不变，直接添加到otherLines数组  
      otherLines.push(line);  
    }  
  }  
  
  const sortedText: string = importLines.concat(otherLines).join('\n');  
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
  return moveImportToFront(a)
}
