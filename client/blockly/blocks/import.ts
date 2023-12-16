
export const import_0 ={
  
  "type": "import",
  "message0": "import { %1 } form \" %2 \"",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "a"
    },
    {
      "type": "field_input",
      "name": "NAME1",
      "text": "b"
    }
  ],
  "colour": 330,
  "tooltip": "",
  "helpUrl": ""

}

export function import_0BlockGenerators(block) {
  let text_name = block.getFieldValue('NAME');
  let text_name1 = block.getFieldValue('NAME1');
  // TODO: Assemble javascript into code variable.
  let code = `import {${text_name}} form "${text_name1}";\n`;
  return code;
};

export const export_const ={

  "type": "export_const",
  "message0": "export const %1 = %2 ",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "inject"
    },
    {
      "type": "field_input",
      "name": "NAME1",
      "text": "[]"
    }
  ],
  "colour": 330,
  "tooltip": "",
  "helpUrl": ""
}

export function export_constBlockGenerators(block) {
  let text_name = block.getFieldValue('NAME');
  let text_name1 = block.getFieldValue('NAME1');
  // TODO: Assemble javascript into code variable.
  let code = `export const ${text_name} = ${text_name1} ;\n`;
  return code;
};

export const importBlocks = [
  import_0,
  export_const
]
  
export const importBlockGenerators = {
    'import':import_0BlockGenerators,
    'export_const':export_constBlockGenerators
}